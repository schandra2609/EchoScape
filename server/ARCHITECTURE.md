# ***System Architecture & Scaling Strategy***

This document outlines the architectural decisions for the **Echoscape API** backend and addresses the core requirements for scaling, cost optimization, caching and security.

---

## 1. How would you scale this to 100K users?

To handle 100K active users, the system will need to be transformed to a horizontally scaled microservices architecture