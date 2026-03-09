use lettre::{
    AsyncSmtpTransport, Tokio1Executor,
    Message, AsyncTransport,
    transport::smtp::authentication::Credentials
};


pub async fn send_email(
    smtp_user: &str,
    smtp_pass: &str,
    to: &str,
    site: &str
) {

    let email = Message::builder()
        .from(smtp_user.parse().unwrap())
        .to(to.parse().unwrap())
        .subject("Updawg Alert")
        .body(format!("{} is DOWN", site))
        .unwrap();

    let creds = Credentials::new(
        smtp_user.to_string(),
        smtp_pass.to_string()
    );

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    let _ = mailer.send(email).await;
}
