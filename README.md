Agri Smart Detect Frontend
==========================

A React-based frontend application for **AI-powered plant disease detection** that empowers **African farmers** to instantly identify plant diseases using AI-powered image analysis, helping them take timely action.

Live Demo
---------

You can view the deployed application here: **https://astounding-griffin-32d04b.netlify.app/**

Features
--------

*   User authentication (login/signup)
    
*   Plant disease detection using AI
    
*   Responsive design optimized for mobile and desktop
    
*   Real-time image analysis
    

Tech Stack
----------

*   **React 19**
    
*   React Router DOM
    
*   CSS3
    
*   Plant.id API integration
    

Environment Variables
---------------------

Create a .env file in the root directory with the following variables. _Note: For the live demo and Render deployment, these are handled via environment settings._

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   REACT_APP_BACKEND_URL=[https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)  REACT_APP_PLANT_ID_API_KEY=your-plant-id-api-key   `

Development
-----------

1.  Clone the repository
    
2.  Install dependencies: npm install
    
3.  Start development server: npm start
    
4.  Open https://astounding-griffin-32d04b.netlify.app/.
    

Deployment on Render
--------------------

This app is configured for deployment on Render using the following files:

*   render.yaml: Render service configuration
    
*   render-build.sh: Custom build script
    
*   package.json: Updated with render-build script
    

### Deployment Steps

1.  Connect your GitHub repository to Render
    
2.  Create a new Static Site service
    
3.  Configure the following settings:
    
    *   **Build Command**: npm run render-build
        
    *   **Publish Directory**: ./build
        
4.  Add environment variables in Render dashboard:
    
    *   REACT\_APP\_BACKEND\_URL
        
    *   REACT\_APP\_PLANT\_ID\_API\_KEY
        
5.  Deploy!
    

Available Scripts
-----------------

*   npm start: Start development server
    
*   npm run build: Build for production
    
*   npm run render-build: Custom build script for Render
    
*   npm test: Run tests
    
*   npm run eject: Eject from Create React App
    

Contributing
------------

1.  Fork the repository
    
2.  Create a feature branch
    
3.  Make your changes
    
4.  Submit a pull request
    

License
-------

This project is licensed under the **MIT License**.
