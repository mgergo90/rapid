## How the system can handle high concurrency.

- We already have the rate limiting
- Creating new url entries also can be done in queues
- We can use multiple databases.

## Approaches to distributed rate-limiting.

Can be done with AWS API gateway

## Scaling queue-based processing for high-throughput analytics.

We can use Kafka or RAbbitMQ or any other queue service

## Strategies for ensuring data consistency in a distributed environment.

Can have a DB for writing and once something changes in that db, sync the rest of the DBs

## API key security best practices.

Don't store any key in code, use github secrets or vault
