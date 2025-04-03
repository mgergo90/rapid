## Explain your choices for entity relationships and storage structure.

I put all the data in one document since mongoDB is not for creating relations between tables (but it supports it)
For rate limit I used redis to put how many times the user used the service

## Justify how your model handles scalability, rate-limiting, and efficient querying.

- I have a Docker file to run the project so any number of instances can be fired up to handle the network traffic. Database would be the bottleneck which alsa can be multiplied with different approaches.
- Rate limiting is solved with a redis db, only 10 request allowed per API Key
- The only field the system use for search is the alias field which has an index
