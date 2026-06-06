# API endpoints

## `GET /api/statistics`

Returns application statistics from the Vipunen API.

What happens:

- Reads cached Vipunen data when the cache is still fresh.
- Fetches new data when the cache is empty or older than 24 hours.
- Merges duplicate records for the same application target.
- Sorts the response before returning JSON.

Optional query parameter:

- `order`: controls the response order. Supported values are `asc`, `desc`,
  `most_popular`, `least_popular`, `most_spots`, and `least_spots`.
  Invalid or missing values use `asc`.

Errors:

- `405`: request method is not `GET` or `HEAD`.
- `500`: Vipunen data could not be fetched.
- `404`: no statistics data is available.

## `GET /api/schools`

Returns degree and school data from the Opintopolku API.

What happens:

- Reads cached Opintopolku data when the cache is still fresh.
- Fetches new data when the cache is empty or older than 24 hours.
- Requests all result pages from Opintopolku, then returns the combined JSON response.

Errors:

- `405`: request method is not `GET` or `HEAD`.
- `500`: Opintopolku data could not be fetched.
