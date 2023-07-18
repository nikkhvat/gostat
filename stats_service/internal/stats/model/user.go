package model

import (
	"time"
)

type Visits struct {
	UId         string    `json:"uid"`          // Unique identifier
	Session     string    `json:"session"`      // User's Session
	TimeEntry   time.Time `json:"time_entry"`   // The time at which the person entered
	Browser     string    `json:"browser"`      // Browser (Chrome, Firefox, etc.)
	Platform    string    `json:"platform"`     // Platform (Linux, Macint32osh, iPhone)
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

type Entry struct {
	Name  string `json:"name"`  // key
	Count int32  `json:"count"` // value
}

// swagger:model Bot
type Bot struct {
	Date    string  `json:"date"`
	Details []Entry `json:"details"`
	Total   int32   `json:"total"`
}

type PageCount struct {
	Title string `json:"title"`
	URL   string `json:"url"`
	Count int32  `json:"count"`
}

type BrowserCount struct {
	Name  string `json:"name"`
	Count int32  `json:"count"`
}

type NameCountPair struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type DateCountPair struct {
	Date  string `json:"date"`
	Count int32  `json:"count"`
}

type URLCountPair struct {
	URL   string `json:"url"`
	Title string `json:"title"`
	Count int32  `json:"count"`
}

type NameCountPairs []NameCountPair

func (pairs NameCountPairs) Len() int {
	return len(pairs)
}

func (pairs NameCountPairs) Less(i, j int) bool {
	return pairs[i].Count < pairs[j].Count
}

func (pairs NameCountPairs) Swap(i, j int) {
	pairs[i], pairs[j] = pairs[j], pairs[i]
}

type TimeCountPair struct {
	Time  string `json:"time"`
	Count int32  `json:"count"`
}

// swagger:model SiteStats
type SiteStats struct {
	TotalVisits      int32           `json:"total_visits"`
	TotalBots        int32           `json:"total_bots"`
	AvgDuration      int64           `json:"avg_duration"`
	FirstVisits      int32           `json:"first_visits"`
	TopPages         []URLCountPair  `json:"top_pages"`
	TopBrowsers      []BrowserCount  `json:"top_browsers"`
	TopCountries     []NameCountPair `json:"top_countries"` // Top countries
	TopOS            []NameCountPair `json:"top_os"`
	FirstVisitsByDay []DateCountPair `json:"visits_by_day"`
	VisitsBotByDay   []Bot           `json:"total_visits_bot"` // Total bots visit by days
	VisitsByHour     []TimeCountPair `json:"visits_by_hour"`
}

// swagger:model VisitsDetails
type VisitsDetails struct {
	Date    string   `json:"date"`    // Date
	Details []Visits `json:"details"` // Details
}

// swagger:model VisitsResponse
type VisitsResponse struct {
	Data SiteStats `json:"data"`
}

// swagger:model SessionResponse
type SessionResponse struct {
	Session string `json:"session"`
}
