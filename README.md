# EzPPTX

The primary purpose of this project is to streamline Adobe Express's presentation process to a PowerPoint format. We noticed a problem that Express only allows for PDFs, PNGs, and JPEGs. To get the presentation to pptx file extension, you have to use another one of Adobe's software, Acrobat. This project aims to eliminate that extra step and have the user instantly convert from image formatting to PowerPoint.

HackSMU WINNER!!!!
Overall and Adobe Challegne

(Working Repo, all branches workflow can be tied back to EzPPTX 1.0)

## Getting Started

These instructions will guide you through setting up and running the project on your local machine for development and testing.

### Prerequisites

The scripts actually set up all the dependencies for node.js and python. An update of the API's client ids with your own would be needed in their respective .env
to run just put 'npm start' on your terminal.

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/EzPPTX.git
cd EzPPTX
```

#### 2. Frontend
```bash
cd hacksmu
npm install
```

#### 3. Backend
```bash
cd backend
npm install
```

### Starting the Product

#### 4. Start Frontend
```bash
npm run build
npm run start
```

This will listen to localhost:5241

#### 5. Start Backend
```bash
node pdf-pptx.js
```

This will start the server on localhost:3000
