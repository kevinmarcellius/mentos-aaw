import math
import random

from locust import HttpUser, task, between
import numpy as np


class PoissonUser(HttpUser):
    """Simulates user behavior with Poisson-distributed wait times and stops execution on failure"""
    
    def poisson_wait_time(self, lambda_rate=5):
        """Generate an exponentially distributed wait time"""
        return -math.log(1.0 - random.random()) / lambda_rate
        # return np.random.exponential(scale=lambda_rate)

    def request_with_fail(self, method, url, json=None, headers=None):
        """Perform a request and stop user execution if the request fails"""
        res = self.client.request(method, url, json=json, headers=headers)
        if res.status_code >= 400:
            raise RuntimeError(f"[X] Request failed: {url} - {res.status_code} - {res.text}")
        return res

    def on_start(self):
        """Each user starts by registering and logging in"""
        self.username = f"user{random.randint(1, 100000)}"
        self.email = f"{self.username}@test.com"
        self.password = "Password123"
        self.full_name = self.username
        self.address = "Example St. 123"
        self.phone_number = "0123456789"

        self.shipping_providers = ["JNE", "TIKI", "SICEPAT", "GOSEND", "GRAB_EXPRESS"]
        self.payment_methods = ["Debit", "Credit", "GoPay", "OVO", "DANA", "QRIS"]

        self.register()
        self.login()

    def register(self):
        self.request_with_fail(
            "POST", 
            "http://localhost:8000/api/auth/register", 
            json={
                "username": self.username,
                "email": self.email,
                "password": self.password,
                "full_name": self.full_name,
                "address": self.address,
                "phone_number": self.phone_number
            }
        )

    def login(self):
        res = self.request_with_fail(
            "POST", 
            "http://localhost:8000/api/auth/login", 
            json={
                "username": self.username, 
                "password": self.password
            }
        )
        self.token = res.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task
    def browse_and_order(self):
        """User journey following Poisson-distributed arrival times"""
        products = self.request_with_fail(
            "GET", 
            "http://localhost:8003/api/product", 
            headers=self.headers
        )
        product_list = products.json()
        if not product_list:
            self.interrupt("[X] No products available")

        product = random.choice(list(product_list["products"]))
        product_id = product["id"]
        product_price = product["price"]

        quantity = random.randint(1, 25)

        # create cart
        self.request_with_fail(
            "POST", 
            "http://localhost:8002/api/cart", 
            json={
                "user": self.username,
                "product_id": product_id,
                "quantity": quantity
            }, 
            headers=self.headers
        )
        order_res = self.request_with_fail(
            "POST", 
            "http://localhost:8002/api/orders/",
            json={
                "user": self.username,
                "shipping_provider": random.choice(self.shipping_providers)
            },
            headers=self.headers
        )
        order_id = order_res.json().get("order").get("id")
        if not order_id:
            self.interrupt("[X] Order ID missing")

        self.request_with_fail(
            "POST", 
            f"http://localhost:8002/api/orders/{order_id}/pay", 
            json={
                "payment_method": random.choice(self.payment_methods),
                "payment_reference": f'PAY_{order_id}',
                "amount": product_price * quantity
            },
            headers=self.headers
        )

        print(f"[*] User {self.username} success.")

    wait_time = lambda self: self.poisson_wait_time(lambda_rate=5)  # Poisson-distributed wait time
