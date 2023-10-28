package service

import (
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/ip2location/ip2location-go"
	"github.com/mssola/useragent"

	"github.com/nik19ta/gostat/stats_service/internal/stats/model"
	"github.com/nik19ta/gostat/stats_service/internal/stats/repository/postgres"
	"github.com/nik19ta/gostat/stats_service/pkg/env"
)

type StatsService struct {
	repo postgres.StatsRepository
}

func NewStatsService(r postgres.StatsRepository) StatsService {
	return StatsService{repo: r}
}

func countryDefinition(ip string) string {
	if ip == "" {
		return "-"
	}

	db, err := ip2location.OpenDB(env.Get("IP_DATABASE_PATH"))

	if err != nil {
		return "-"
	}
	defer db.Close()

	results, err := db.Get_country_short(ip)

	if err != nil {
		return "-"
	}

	return results.Country_short
}

func (s StatsService) SetVisits(UserAgent, IP, App, Pathname, Host, Hash, Title, Resolution, Source, Medium, Campaign, Term, Content string, Unique bool) (string, error) {
	ua := useragent.New(UserAgent)

	var userSession string
	userSession = uuid.New().String()

	browserName, _ := ua.Browser()

	country := countryDefinition(IP)

	ua.Model()

	timeNow := time.Now()

	data := model.Visits{
		UId:         uuid.New().String(),
		Platform:    ua.Platform(),
		Os:          ua.OS(),
		Session:     userSession,
		TimeEntry:   timeNow,
		Browser:     browserName,
		TimeLeaving: timeNow,
		Country:     country,
		Unique:      Unique,
		Ip:          IP,
		Resolution:  Resolution,
		Source:      Source,
		Medium:      Medium,
		Campaign:    Campaign,
		Term:        Term,
		Content:     Content,
		Title:       Title,
		AppId:       App,
		Pathname:    Pathname,
		Host:        Host,
		Hash:        Hash,
	}

	err := s.repo.AddVisit(data)

	return userSession, err
}

func (s StatsService) VisitExtend(session string) error {
	return s.repo.VisitExtend(session)
}

func containsBot(browser string, os string) bool {
	lowerBrowser := strings.ToLower(browser)
	lowerOs := strings.ToLower(os)
	return strings.Contains(lowerBrowser, "bot") || strings.Contains(lowerBrowser, "headless") || strings.Contains(lowerOs, "bot")
}

func getTotal(details []model.Entry) int32 {
	var total int32
	total = 0

	for _, entry := range details {
		total += entry.Count
	}
	return total
}

func mergeEntries(entries []model.Entry) []model.Entry {
	merged := make(map[string]int32)
	for _, entry := range entries {
		merged[entry.Name] += entry.Count
	}

	mergedEntries := make([]model.Entry, 0, len(merged))
	for name, count := range merged {
		mergedEntries = append(mergedEntries, model.Entry{Name: name, Count: count})
	}

	return mergedEntries
}

func convertToBots(data map[string][]model.Entry, startDate, endDate string) []model.Bot {
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)

	bots := []model.Bot{}
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		date := d.Format("2006-01-02")
		details, ok := data[date]
		if !ok {
			details = []model.Entry{}
		} else {
			details = mergeEntries(details)
		}

		total := getTotal(details)

		bot := model.Bot{
			Date:    date,
			Details: details,
			Total:   total,
		}
		bots = append(bots, bot)
	}
	return bots
}

func sortAndSliceTopBrowsers(browserCounter map[string]int) []model.BrowserCount {
	browsers := make([]model.BrowserCount, 0, len(browserCounter))

	for name, count := range browserCounter {
		browsers = append(browsers, model.BrowserCount{Name: name, Count: int32(count)})
	}

	sort.Slice(browsers, func(i, j int) bool {
		return browsers[i].Count > browsers[j].Count
	})

	return browsers
}

func sortAndSliceTopCountries(countryCounter map[string]int) []model.NameCountPair {
	sortedCountries := make(model.NameCountPairs, 0, len(countryCounter))

	for country, count := range countryCounter {
		sortedCountries = append(sortedCountries, model.NameCountPair{
			Name:  country,
			Count: count,
		})
	}

	sort.Sort(sort.Reverse(sortedCountries))

	return sortedCountries
}

func calculateSiteStats(visits []model.Visits) model.SiteStats {
	stats := model.SiteStats{}

	// * Создаем временные хранилища
	topPagesMap := make(map[string]model.URLCountPair)
	browserCounter := make(map[string]int)
	countryCounter := make(map[string]int)
	visitsByHourMap := make(map[int]int)
	sessionCounter := make(map[string]bool)
	topOSMap := make(map[string]int)
	botsByDate := make(map[string][]model.Entry)

	var totalDuration time.Duration

	// * Создайте отображение для хранения информации о первых посещениях по сессиям
	firstVisitSessions := make(map[string]bool)

	// * Создайте отображение для хранения информации о первых посещениях по дням
	firstVisitsByDayMap := make(map[string]int)

	// * Получите текущую дату и вычислите дату 30 дней назад
	now := time.Now()
	startDate := now.AddDate(0, 0, -30)

	for _, visit := range visits {
		date := visit.TimeEntry.Format("2006-01-02")
		// * Если браузер содержит "bot", учитываем его как бота
		if containsBot(visit.Browser, visit.Os) {
			stats.TotalBots++

			lowerOs := strings.ToLower(visit.Os)

			if strings.Contains(lowerOs, "yandex") {
				botsByDate[date] = append(botsByDate[date], model.Entry{
					Name:  "YandexBot",
					Count: 1,
				})
			} else {
				botsByDate[date] = append(botsByDate[date], model.Entry{
					Name:  visit.Browser,
					Count: 1,
				})
			}

			continue
		}

		if _, ok := firstVisitSessions[visit.Session]; !ok {
			firstVisitSessions[visit.Session] = true

			// * Если посещение находится в интервале последних 30 дней
			if visit.TimeEntry.After(startDate) {
				// * Получите дату посещения без времени
				visitDate := visit.TimeEntry.Format("2006-01-02")

				// * Обновление информации о первых посещениях по дням
				firstVisitsByDayMap[visitDate]++
			}

			// * Обновление информации о топ-ОС
			topOSMap[visit.Os]++

			// * Обновляем счетчик для браузера
			browserCounter[visit.Browser]++

			// * Обновляем счетчик для страны
			countryCounter[visit.Country]++

			// * Получите час посещения
			// * Обновление информации о посещениях по часам
			visitHour := visit.TimeEntry.Hour()
			visitsByHourMap[visitHour]++
		}

		// * Иначе учитываем его как обычное посещение
		stats.TotalVisits++

		// * Обновляем счетчик для уникальных сессий
		sessionCounter[visit.Session] = true

		// * Обновляем сумму продолжительности
		totalDuration += visit.TimeLeaving.Sub(visit.TimeEntry)

		// * Обновление информации о топ-страницах
		if page, ok := topPagesMap[visit.Pathname]; ok {
			page.Count++
			topPagesMap[visit.Pathname] = page
		} else {
			topPagesMap[visit.Pathname] = model.URLCountPair{
				URL:   visit.Pathname,
				Title: visit.Title,
				Count: 1,
			}
		}

		// * Конвертирование отображения firstVisitsByDayMap в срез firstVisitsByDay

		var firstVisitsByDay []model.DateCountPair
		for date := startDate; !date.After(now); date = date.AddDate(0, 0, 1) {
			formattedDate := date.Format("2006-01-02")
			count := firstVisitsByDayMap[formattedDate]
			firstVisitsByDay = append(firstVisitsByDay, model.DateCountPair{Date: formattedDate, Count: int32(count)})
		}

		stats.FirstVisitsByDay = firstVisitsByDay
	}

	// Вычисляем среднюю продолжительность посещения
	if stats.TotalVisits > 0 {
		stats.AvgDuration = int64((totalDuration / time.Duration(stats.TotalVisits)) / 1000000)
	}

	// * Вычисляем количество уникальных сессий
	stats.FirstVisits = int32(len(sessionCounter))

	// * Сортируем и добавляем топ страниц
	// Конвертирование отображения topPagesMap в срез topPages
	var topPages []model.URLCountPair
	for _, page := range topPagesMap {
		topPages = append(topPages, page)
	}

	// Сортировка topPages по убыванию count
	sort.Slice(topPages, func(i, j int) bool {
		return topPages[i].Count > topPages[j].Count
	})

	stats.TopPages = topPages

	// * Сортируем и добавляем топ браузеров
	stats.TopBrowsers = sortAndSliceTopBrowsers(browserCounter)

	// * Сортируем и добавляем топ стран
	stats.TopCountries = sortAndSliceTopCountries(countryCounter)

	// * Конвертирование отображения topOSMap в срез topOS
	var topOS []model.NameCountPair
	for name, count := range topOSMap {
		topOS = append(topOS, model.NameCountPair{Name: name, Count: count})
	}

	// * Конвертирование отображения visitsByHourMap в срез visitsByHour
	var visitsByHour []model.TimeCountPair
	for hour := 0; hour < 24; hour++ {
		count := visitsByHourMap[hour]
		visitsByHour = append(visitsByHour, model.TimeCountPair{Time: strconv.Itoa(hour), Count: int32(count)})
	}

	stats.VisitsByHour = visitsByHour

	// * Сортировка topOS по убыванию count
	sort.Slice(topOS, func(i, j int) bool {
		return topOS[i].Count > topOS[j].Count
	})

	// * Start top Bots
	endDateBot := now.Format("2006-01-02")
	startDateBot := now.AddDate(0, 0, -16).Format("2006-01-02")

	bots := convertToBots(botsByDate, startDateBot, endDateBot)

	stats.VisitsBotByDay = bots

	stats.TopOS = topOS

	return stats
}

func (s StatsService) GetVisits(app string) (model.SiteStats, error) {
	data, err := s.repo.GetVisits(app)

	if err != nil {
		return model.SiteStats{}, err
	}

	resp := calculateSiteStats(data)

	return resp, nil
}

func (s StatsService) DeleteByAppId(app string) error {
	s.repo.DeleteByAppId(app)

	return nil
}
