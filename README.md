# Debatize - Real-Time Anonymous Debate Platform

A modern, real-time anonymous chat application focused on structured debates with AI moderation and Reddit-style voting system.

## 🚀 Features

- **Real-time Anonymous Chat**: Connect instantly with other users for live debates
- **AI Moderation**: Built-in AI moderator to filter inappropriate content and maintain civil discussions
- **Reddit-style Voting**: Upvote/downvote system for community-driven content curation
- **Mobile-Responsive Design**: Swipe-to-reply functionality and optimized mobile experience
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions
- **Persistent Storage**: MongoDB integration for message history and user data
- **Custom Branding**: Easy logo integration and customization

## 🛠️ Tech Stack

- **Frontend**: React.js with modern CSS
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.io
- **Database**: MongoDB (with in-memory fallback)
- **AI Moderation**: Custom content filtering system
- **Deployment**: Ready for deployment on various platforms

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd debatize
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/debatize
   PORT=3001
   ```

4. **Start the development servers**
   ```bash
   # Start the backend server (from root directory)
   npm run dev
   
   # In a new terminal, start the frontend (from client directory)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🎯 Usage

1. **Join a Debate**: Simply open the app and start typing to join the conversation
2. **Vote on Messages**: Use the upvote/downvote buttons to curate content
3. **Stay Civil**: The AI moderator will warn about inappropriate language
4. **Mobile Experience**: Swipe on messages to reply on mobile devices

## 🔧 Configuration

### Logo Customization
1. Replace `client/public/logo1.png` with your logo
2. Update the logo references in the code if needed
3. Refresh the browser to see changes

### AI Moderation
The AI moderator can be customized by modifying the content filtering rules in `server.js`.

### Database Setup
- **MongoDB**: Set up a local MongoDB instance or use MongoDB Atlas
- **In-Memory**: The app automatically falls back to in-memory storage if MongoDB is unavailable

## 🚀 Deployment

### Heroku
1. Create a new Heroku app
2. Connect your GitHub repository
3. Set environment variables in Heroku dashboard
4. Deploy

### Vercel/Netlify
1. Build the client: `cd client && npm run build`
2. Deploy the build folder to your preferred platform
3. Deploy the server separately

## 📱 Mobile Features

- **Swipe-to-Reply**: Swipe left on messages to reply
- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and smooth interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Roadmap

- [ ] User authentication system
- [ ] Multiple debate rooms
- [ ] Advanced moderation tools
- [ ] Mobile app development
- [ ] Analytics dashboard
- [ ] Integration with social media platforms

---

**Built with ❤️ for fostering meaningful discussions and debates online.** 