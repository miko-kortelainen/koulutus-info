package services

type Order string

const (
	OrderAsc          Order = "asc"
	OrderDesc         Order = "desc"
	OrderMostPopular  Order = "most_popular"
	OrderLeastPopular Order = "least_popular"
	OrderMostSpots    Order = "most_spots"
	OrderLeastSpots   Order = "least_spots"
)

func (o Order) IsValid() bool {
	switch o {
	case OrderAsc, OrderDesc, OrderMostPopular, OrderLeastPopular, OrderMostSpots, OrderLeastSpots:
		return true
	}
	return false
}
