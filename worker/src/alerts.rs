use lettre::{
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};

pub async fn send_email(
    user: &str,
    pass: &str,
    to: &str,
    url: &str,
) -> anyhow::Result<()> {  

    let email = Message::builder()
        .from(user.parse()?)
        .to(to.parse()?)
        .subject("UpDawg Alert: Site Down")
        .body(format!("⚠️ {} is DOWN", url))?;

    let creds = Credentials::new(user.to_string(), pass.to_string());

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")?
        .credentials(creds)
        .build();

    mailer.send(email).await?;

    println!("Alert email sent for {}", url);

    Ok(())   
}