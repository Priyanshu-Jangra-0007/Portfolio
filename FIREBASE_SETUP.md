# Firebase Setup Instructions

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web icon (</>) to add a web app (if you haven't already)
7. Copy your Firebase configuration object

## Step 2: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode"
4. Select a location for your database
5. Click "Enable"

## Step 4: Configure Firestore Rules (Important!)

Go to the "Rules" tab in Firestore and update the rules:

### For Development (Test Mode):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### For Production (Recommended):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document=**} {
      allow read: if false;  // Only you can read via Firebase Console
      allow write: if request.resource.data.keys().hasAll(['name', 'email', 'message', 'timestamp'])
                   && request.resource.data.name is string
                   && request.resource.data.email is string
                   && request.resource.data.message is string
                   && request.resource.data.name.size() > 0
                   && request.resource.data.email.matches('.*@.*\\..*')
                   && request.resource.data.message.size() > 0;
    }
  }
}
```

## Step 5: Test Your Form

1. Open your website
2. Fill out the contact form
3. Click "Submit"
4. Check Firebase Console > Firestore Database > contacts collection
5. You should see your submission there!

## Data Structure

Each contact form submission will be stored with:
- `name`: User's name
- `email`: User's email
- `message`: User's message
- `timestamp`: Server timestamp
- `status`: "new" (you can update this manually to track responses)

## Viewing Submissions

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click on the "contacts" collection
4. You'll see all submissions with their details

## Security Notes

⚠️ **Important**: 
- Never commit your actual Firebase credentials to public repositories
- Use environment variables for production
- Set up proper Firestore security rules
- Consider adding rate limiting to prevent spam

## Optional: Email Notifications

To receive email notifications when someone submits the form, you can:
1. Set up Firebase Cloud Functions
2. Use a service like SendGrid or Mailgun
3. Or use Firebase Extensions (Email Trigger)

## Troubleshooting

If the form doesn't work:
1. Check browser console for errors
2. Verify Firebase credentials are correct
3. Ensure Firestore is enabled
4. Check Firestore security rules
5. Make sure you're not blocking third-party cookies
