package service

import (
	"net/smtp"

	"github.com/matcornic/hermes/v2"
	"github.com/nik19ta/gostat/mail_service/pkg/env"
)

type MailService struct {
	error bool
}

func NewMailService() MailService {
	return MailService{}
}

func sendEmail(to, subject, body string) error {
	from := env.Get("MAIL_LOGIN")
	pass := env.Get("MAIL_PASSWORD")
	mailSmtp := env.Get("MAIL_SMTP")
	mailHost := env.Get("MAIL_HOST")

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n" +
		"Content-Type: text/html\n\n" +
		body

	err := smtp.SendMail(mailSmtp,
		smtp.PlainAuth("", from, pass, mailHost),
		from, []string{to}, []byte(msg))

	return err
}

func (s MailService) SendMailResetPassword(email, first_name, second_name, secret_code string) error {
	h := hermes.Hermes{
		Product: hermes.Product{
			Name:      "GoStat",
			Link:      "https://gostat.app",
			Copyright: "-",
		},
	}

	em := hermes.Email{
		Body: hermes.Body{
			Name: first_name + " " + second_name,
			Intros: []string{
				"Reset password",
			},
			Actions: []hermes.Action{
				{
					Instructions: "To get started with GoStat, please click here:",
					Button: hermes.Button{
						Color: "#22BC66",
						Text:  "Confirm your account",
						Link:  "https://gostat.app/auth/confirm?code=" + secret_code,
					},
				},
			},
		},
	}

	emailBody, err := h.GenerateHTML(em)
	if err != nil {
		return err
	}

	if err := sendEmail(email, "Reset password", emailBody); err != nil {
		return err
	}

	return nil
}

func (s MailService) SendMail(email, first_name, second_name, secret_code string) error {

	h := hermes.Hermes{
		Product: hermes.Product{
			Name:      "GoStat",
			Link:      "https://gostat.app",
			Copyright: "-",
		},
	}

	em := hermes.Email{
		Body: hermes.Body{
			Name: first_name + " " + second_name,
			Intros: []string{
				"Welcome to GoStat!",
			},
			Actions: []hermes.Action{
				{
					Instructions: "To get started with GoStat, please click here:",
					Button: hermes.Button{
						Color: "#22BC66",
						Text:  "Confirm your account",
						Link:  "https://gostat.app/auth/confirm?code=" + secret_code,
					},
				},
			},
		},
	}

	emailBody, err := h.GenerateHTML(em)
	if err != nil {
		return err
	}

	if err := sendEmail(email, "Welcome to GoStat!", emailBody); err != nil {
		return err
	}

	return nil
}
