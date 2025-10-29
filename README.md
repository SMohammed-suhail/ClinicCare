ClinicCares is a web-based clinic management system designed to streamline operations for doctors, receptionists, and patients. With separate login roles for doctors and receptionists, the system handles token generation, patient information management, prescription tracking, and billing—ensuring a smooth workflow from patient entry to checkout.

live demo -  https://cliniccares.netlify.app/
The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# Login Credentials (for demo/testing) -

Doctor: Sign up using the “Doctor” role option.

Receptionist: Sign up using the “Receptionist” role option.

Alternatively, insert demo accounts in the database for quick testing.

# Workflow Overview -

The receptionist logs in and registers a new patient or selects an existing patient.

Upon registration or new entry, the system issues a token automatically.

The patient waits and is then seen by the doctor, who logs in with their account, views the patient’s information and prior history, and records or updates the prescription.

After the consultation, the receptionist records any charges or fees associated with the visit.

The system uses the recorded charges to generate a bill, which can be printed or downloaded for the patient.

# Future Enhancements -

Add more roles (e.g., Nurse, Lab Technician, Admin).

Integrate certificate generation or patient discharge summary.

Email/SMS notifications for appointment reminders or token status.

Secure payment gateway integration for bills.

Analytics dashboard for doctors and clinic management (visit trends, revenue, etc.).

Mobile-friendly or PWA version for easy access on tablets/phones.

# Acknowledgments -

Special thanks to all contributors and open-source libraries used in this project.

 
