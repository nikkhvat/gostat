package model

import (
	"time"
)

// Ваша модель пользователя
type Visits struct {
	UId         string    `json:"uid"`          // Unique identifier
	Session     string    `json:"session"`      // User's Session
	TimeEntry   time.Time `json:"time_entry"`   // The time at which the person entered
	Browser     string    `json:"browser"`      // Browser (Chrome, Firefox, etc.)
	Platform    string    `json:"platform"`     // Platform (Linux, Macintosh, iPhone)
	Os          string    `json:"os"`           // Operating system (Windows, macOS, etc.)
	TimeLeaving time.Time `json:"time_leaving"` // The time when the user left the site
	Country     string    `json:"country"`      // Short country code (EE, DE, etc.)
	Unique      bool      `json:"unique"`       // Has the user already logged in or not
	URL         string    `json:"url"`          // URL page
	Title       string    `json:"title"`        // Title of page
	Ip          string    `json:"ip"`           // The IP address from which
	Utm         string    `json:"utm"`          // the UTM tag id came in
	HTTPReferer string    `json:"http_referer"` // Http Refer
	AppId       string    `json:"app_id"`       // Id app
}
