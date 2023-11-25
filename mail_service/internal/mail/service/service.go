package service

import (
	"github.com/matcornic/hermes/v2"
	"github.com/nik19ta/gostat/mail_service/pkg/env"

	"github.com/go-mail/mail"
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

	m := mail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := mail.NewDialer("smtp.gmail.com", 587, from, pass)

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	return nil
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
					Instructions: "Click the button below to reset your password:",
					Button: hermes.Button{
						Color: "#DC4D2F",
						Text:  "Reset pasword",
						Link:  "https://gostat.app/auth/password-recovery/confirm?code=" + secret_code,
					},
				},
			},
			Outros: []string{
				"If you did not request a password reset, no further action is required on your part.",
			},
			Signature: "Thanks",
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
