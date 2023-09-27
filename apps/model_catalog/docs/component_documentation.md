# EBRAINS Model Catalog app: Components description 


1. **ViewSelected.js**:
   - Description: Defines a React component called `ViewSelected` for displaying selected data in a dialog box.
   - Components:
     - `EntityParameter`: A functional component to render a table row for a particular parameter of the selected entities.
     - `ViewSelected`: A class component to render a dialog box with a table displaying parameters of the selected entities.

2. **auth.js**:
   - Description: Contains functions for initializing and handling authentication using Keycloak.
   - Functions:
     - `initAuth`: Initializes Keycloak authentication.
     - `checkAuth`: Checks the authentication status and handles different scenarios based on the application's context (standalone, framed, or delegate).
     - `verifyMessage`: Verifies messages received from other tabs during the authentication process.

3. **utils.js**:
   - Description: Contains utility functions used across the application.
   - Functions:
     - `capitalizeFirstLetter`: Capitalizes the first letter of a string.
     - `formatBytes`: Formats a byte size value into a human-readable format.
     - `getFileNameFromPath`: Extracts the file name from a file path.
     - `getFormattedDateTime`: Formats a date and time string.
     - `isValidURL`: Checks if a string is a valid URL.

4. **AuthWidget.js**:
   - Description: Defines a React component called `AuthWidget` for displaying the authentication widget.
   - Props:
     - `currentUser`: The current user's name.
     - `setCurrentUser`: A function to set the current user's name.

5. **ColoredCircularProgress.js**:
    - Description: Defines a React component called `ColoredCircularProgress` for rendering a colored circular progress indicator.
    - Props:
      - Inherits all props from Material-UI's `CircularProgress` component.

6. **WarningBox.js**:
   - Description: Defines a React component called `WarningBox` for displaying warning messages.
   - Props:
     - `message`: The warning message to display. If the message is "ok" or undefined, nothing is rendered.

7. **TestTable.js**:
   - Description: The `TestTable` component is a React component designed to display a table of test data. It utilizes the `mui-datatables` library for rendering the table and `@material-ui/core/styles` for theming. The component has several methods to handle actions like downloading selected JSON, hiding table rows, viewing selected items, adding tests to compare, and handling the closing of view selected items. It also defines a custom theme for the table using the `createMuiTheme` function. The component is wrapped with `withSnackbar` to enable notification features.

8. **theme.js**:
   - Description: The `theme.js` file exports a default object that defines a color scheme for various UI elements. It includes colors for backgrounds, table headers, table rows, text, buttons, and other UI elements. This theme object can be used throughout the app to maintain a consistent color scheme and styling.

9. **ThreeWaySwitch.js**:
   - Description: The `ThreeWaySwitch` component is a React component that renders a three-way switch UI element. It uses styled-components to define styled divs and input elements for the switch, labels, and radio buttons. The component maintains a local state to keep track of the selected value and provides a method to handle changes to the selection. It renders a set of radio buttons and labels for each value, and a selection span that visually indicates the current selection. The position of the selection span is updated based on the selected value to provide a visual indication of the current selection to the user.

10. **ValidationFramework.js**:
   - Description: Defines a class called `ValidationFramework` for validating form inputs.
   - Classes:
     - `ValidationFramework`: A class to handle form validation.
       - Methods:
         - `validate`: Validates the form data based on the defined rules.
         - `isValid`: Checks if the form data is valid.
         - `getErrors`: Retrieves the validation errors.
   - Functions:
     - `validateField`: Validates a single form field based on the defined rules.
     - `validateForm`: Validates the entire form based on the defined rules.


11. **ConfigForm.js**:
    - Description: Defines a React component for rendering a configuration form.

12. **ContextMain.js**:
    - Description: Defines the main context for the application using React's Context API.
    - Exports:
        - `ContextMain`: The main context created using `React.createContext()`.
        - `ContextMainProvider`: A provider component for `ContextMain` that holds the state and methods for managing authentication, filters, model comparisons, test comparisons, and status.
    - State:
        - `auth`: An object representing authentication state.
        - `filters`: An object representing filter state.
        - `validFilterValues`: A state for holding valid filter values, initially set to `null`.
        - `compareModels`: An object representing the state for comparing models.
        - `compareTests`: An object representing the state for comparing tests.
        - `status`: A string representing the status, initially set to an empty string.


13. **datastore.js**:
    - Description: Contains functions for interacting with the data store.
    - Functions:
      - `fetchData`: Fetches data from the data store.
      - `saveData`: Saves data to the data store.

14. **ErrorDialog.js**:
    - Description: Defines a React component called `ErrorDialog` for displaying error messages in a dialog.


15. **globals.js**:
    - Description: Contains global variables and constants used across the application.
    - Variables:
      - `DevMode`: A boolean indicating whether the application is in development mode. Set to `false` for production.
      - `baseUrl`: The base URL for the validation service.
      - `querySizeLimit`: The maximum size for queries.
      - `collaboratoryOrigin`: The origin URL for the collaboratory.
      - `hashChangedTopic`: The topic for hash change events in the community app.
      - `updateSettingsTopic`: The topic for updating settings in the community app.
      - `isParent`: A boolean indicating whether the current window is a parent window.
      - `isIframe`: A boolean indicating whether the current window is an iframe.
      - `isFramedApp`: A boolean indicating whether the current app is framed.
      - `settingsDelimiter`: The delimiter for settings, set to a comma.
      - `filterCommonKeys`: Common filter keys for both models and tests.
      - `ADMIN_PROJECT_ID`: The project ID for admin.
      - `corsProxy`: The URL of the CORS proxy to use.
    - Functions:
      - `updateHash(value)`: Updates the hash in the URL and posts a message to the parent window if the app is framed.

16. **globals-staging.js**:
    - Description: Contains staging global variables and constants used across the application, similar to globals.js but for the staging environment.

17. **index.js**:
    - Description: Entry point of the application where the React app is rendered.
    - Functions:
      - `registerServiceWorker`: Registers the service worker for offline caching.
      - `renderApp`: Renders the React app.

18. **Introduction.js**:
    - Description: Defines a React component called `Introduction` for displaying an introduction section.

19. **LoadingIndicator.js**:
    - Description: Defines a React component called `LoadingIndicator` for rendering a loading indicator.

20. **LoadingIndicatorModal.js**:
    - Description: Defines a React component called `LoadingIndicatorModal` for rendering a modal with a loading indicator.

21. **Markdown.js**:
    - Description: The `Markdown.js` file contains utility functions for working with Markdown content. It exports a function `renderMarkdown` which takes a Markdown string as an argument and returns HTML string using the `marked` library.

22. **ModelAddForm.js**:
    - Description: The `ModelAddForm.js` file defines a React component named `ModelAddForm` for adding a new model. It imports various components and libraries such as React, Material-UI components, and custom components. The `ModelAddForm` component contains form fields for entering model details and has methods for handling form submission and validation.

23. **ModelDetail.js**:
    - Description: The `ModelDetail.js` file defines a `ModelDetail` React component for displaying detailed information about a model.
    - Key Points:
        1. **Import Statements**: Libraries and components such as React, PropTypes, Material-UI components, and custom components like `ModelDetailHeader`, `ModelDetailContent`, etc., are imported.
        2. **Styles**: A `styles` constant is defined for styling elements within the component using Material-UI's styling solution.
        3. **TabPanel and MyDialogTitle Functions**: Functional components for rendering tab panels and a custom dialog title bar are defined.
        4. **ModelDetail Class**: 
            - The class extends `React.Component` and initializes state variables like `tabValue`, `results`, `loadingResult`, etc., in the constructor.
            - Methods like `updateCurrentModelData`, `checkCompareStatus`, `addModelCompare`, `removeModelCompare`, etc., are defined for various functionalities.
            - The `render` method defines the JSX structure of the component which includes a dialog with various tabs for displaying different pieces of information about the model.
        5. **PropTypes and Export**: 
            - PropTypes are defined for `ModelDetail` to enforce the type of props that must be passed.
            - The `ModelDetail` component is exported as the default export of the module, wrapped with `withSnackbar` and `withStyles` higher-order components for snackbar notifications and custom styles, respectively.


24. **ModelDetailContent.js**:
    - Description: Defines a React component called `ModelDetailContent` for rendering the content of the model detail view.

25. **ModelDetailHeader.js**:
    - Description: Defines a React component called `ModelDetailHeader` for rendering the header of the model detail view.

26. **ModelDetailMetadata.js**:
    - Description: Defines a React component called `ModelDetailMetadata` for rendering the metadata of a model in the detail view.

27. **ModelEditForm.js**:
    - Description: Defines a React component called `ModelEditForm` for editing an existing model.

28. **ModelInstanceAddForm.js**:
    - Description: Defines a React component called `ModelInstanceAddForm` for adding a new model instance.

29. **ModelInstanceArrayOfForms.js**:
    - Description: Defines a React component called `ModelInstanceArrayOfForms` for rendering an array of model instance forms.

30. **ModelInstanceEditForm.js**:
    - Description: Defines a React component called `ModelInstanceEditForm` for editing an existing model instance.

31. **ModelInstanceForm.js**:
    - Description: Defines a React component called `ModelInstanceForm` for rendering a model instance form.

32. **ModelResultOverview.js**:
    - Description: Defines a React component called `ModelResultOverview` for displaying an overview of model results.

33. **ModelTable.js**:
    - Description: Defines a React component called `ModelTable` for rendering a table of models.

34. **MUIDataTableCustomRowToolbar.js**:
    - Description: Defines a custom row toolbar component used in the Material-UI DataTable.

35. **MUIDataTableCustomToolbar.js**:
    - Description: Defines a custom toolbar component used in the Material-UI DataTable.

36. **MultipleSelect.js**:
    - Description: Defines a React component called `MultipleSelect` for rendering a multiple select input field.

37. **PersonSelect.js**:
    - Description: Defines a React component called `PersonSelect` for rendering a person select input field.

38. **ResultDetail.js**:
    - Description: Defines a React component called `ResultDetail` for displaying detailed information about a test result.

39. **ResultDetailContent.js**:
    - Description: Defines a React component called `ResultDetailContent` for rendering the content of the result detail view.

40. **ResultDetailHeader.js**:
    - Description: Defines a React component called `ResultDetailHeader` for rendering the header of the result detail view.

41. **ResultGraphs.js**:
    - Description: Defines a React component called `ResultGraphs` for displaying graphs related to a test result.


# Directories structure 

/src
├── /components
│   ├── /Auth
│   │   ├── auth.js
│   │   └── AuthWidget.js
│   ├── /Forms
│   │   ├── ConfigForm.js
│   │   ├── ModelAddForm.js
│   │   ├── ModelEditForm.js
│   │   ├── ModelInstanceAddForm.js
│   │   ├── ModelInstanceEditForm.js
│   │   ├── ModelInstanceForm.js
│   │   ├── TestAddForm.js
│   │   ├── TestEditForm.js
│   │   ├── TestInstanceAddForm.js
│   │   ├── TestInstanceEditForm.js
│   │   └── TestInstanceForm.js
│   ├── /Layout
│   │   ├── ConfigDisplaySimple.js
│   │   ├── ConfigDisplayTop.js
│   │   ├── ConfigDisplayTop.js
│   │   ├── ErrorDialog.js
│   │   ├── LoadingIndicator.js
│   │   ├── LoadingIndicatorModal.js
│   │   ├── Markdown.js
│   │   ├── MUIDataTableCustomRowToolbar.js
│   │   ├── MUIDataTableCustomToolbar.js
│   │   └── SearchBar.js
│   ├── /Model
│   │   ├── ModelDetail.js
│   │   ├── ModelDetailContent.js
│   │   ├── ModelDetailHeader.js
│   │   ├── ModelDetailMetadata.js
│   │   ├── ModelResultOverview.js
│   │   └── ModelTable.js
│   ├── /Result
│   │   ├── ResultDetail.js
│   │   ├── ResultDetailContent.js
│   │   ├── ResultDetailHeader.js
│   │   ├── ResultGraphs.js
│   │   ├── ResultModelTestInfo.js
│   │   └── ResultRelatedFiles.js
│   ├── /Compare
│   │   ├── CompareMultiGraphs.js
│   │   └── CompareMultiResults.js
│   ├── /Select
│   │   ├── MultipleSelect.js
│   │   ├── PersonSelect.js
│   │   └── SingleSelect.js
│   ├── ColoredCircularProgress.js
│   ├── SwitchMultiWay.js
│   └── ContextMain.js
├── /services
│   └── datastore.js
├── /utils
│   ├── theme.js
│   └──  utils.js
├── globals-staging.js
├── globals.js
├── Introduction.js
├── ValidationFramework.js
├── App.css
├── index.js
├── setupTests.js
└── ViewSelected.js