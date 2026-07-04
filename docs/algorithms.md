# Algorithms

LimitLayer supports multiple rate-limiting algorithms. Each algorithm is designed for different traffic patterns and use cases.

## Fixed Window

### How it works

Requests are counted within fixed time windows.

Example:

```text
Window 1 (00:00–01:00)

Request count: 5/5

↓

Window resets

↓

Window 2 (01:00–02:00)

Request count: 0/5
```

### Advantages

* Simple implementation
* Fast
* Minimal memory usage

### Trade-offs

Traffic spikes can occur at window boundaries because the counter resets completely.

### Best for

* Internal APIs
* Admin dashboards
* Low-traffic services

---

## Sliding Window

### How it works

Instead of resetting immediately, Sliding Window combines requests from the previous and current windows to estimate the effective request count.

This provides smoother rate limiting and reduces burst traffic around window boundaries.

### Advantages

* Fairer request distribution
* Reduces boundary spikes
* Better user experience

### Trade-offs

Slightly more computation than Fixed Window.

### Best for

* Authentication endpoints
* Login APIs
* Public REST APIs
* User-facing services

---

## Planned Algorithms

### Token Bucket

Maintains a bucket of tokens that refill over time.

Ideal for APIs that should allow occasional bursts while maintaining an average request rate.

Best for:

* Public APIs
* SDKs
* Mobile applications

---

### Sliding Log

Stores timestamps for each request.

Provides highly accurate rate limiting at the cost of additional memory.

Best for:

* Authentication
* OTP verification
* Security-sensitive endpoints

---

### Leaky Bucket

Processes requests at a constant rate.

Useful for smoothing incoming traffic and preventing sudden spikes.

Best for:

* Webhooks
* Queue processing
* Payment systems

---

## Choosing an Algorithm

| Algorithm      | Fairness | Performance | Memory | Typical Use       |
| -------------- | :------: | :---------: | :----: | ----------------- |
| Fixed Window   |    ⭐⭐⭐   |    ⭐⭐⭐⭐⭐    |  ⭐⭐⭐⭐⭐ | Internal APIs     |
| Sliding Window |   ⭐⭐⭐⭐   |     ⭐⭐⭐⭐    |  ⭐⭐⭐⭐  | Authentication    |
| Token Bucket   |   ⭐⭐⭐⭐⭐  |     ⭐⭐⭐⭐    |  ⭐⭐⭐⭐  | Public APIs       |
| Sliding Log    |   ⭐⭐⭐⭐⭐  |     ⭐⭐⭐     |   ⭐⭐   | Security          |
| Leaky Bucket   |   ⭐⭐⭐⭐   |     ⭐⭐⭐⭐    |  ⭐⭐⭐⭐  | Traffic smoothing |
