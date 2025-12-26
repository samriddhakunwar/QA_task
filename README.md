# QA Task: Signup Automation

This is a small project I did to automate the signup process on a demo website: [Authorized Partner Demo](https://authorized-partner.vercel.app/).  
I used **Puppeteer** to make a script that fills the signup form automatically and submits it.  

---

## What it does

- Fills all the required fields:
  - First Name
  - Last Name
  - Email (auto-generated every time so it’s unique)
  - Password
  - Confirm Password
- Handles optional checkboxes (like terms and conditions)
- Checks if the signup was successful by looking for page changes or messages
- Prints logs in the console so you can see what’s happening
- Saves a screenshot if something goes wrong

---

## How to run it

1. Clone this repo:

```bash
git clone https://github.com/samriddhakunwar/QA_task.git
cd QA_task
