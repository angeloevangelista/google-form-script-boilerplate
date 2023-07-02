class JiraService {
  /**
   * Creates an instance of JiraService.
   *
   * This class handles the Jira server interaction
   */
  constructor() {
    this._baseUrl = `https://${CONFIG.jira.workspace}.atlassian.net/rest/api/3`;
    this._defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Basic ${this._getEncodedToken()}`,
    };
  }

  /**
   * Returns the base64 encoded token.
   * @returns {string} The base64 encoded token.
   * @private
   */
  _getEncodedToken() {
    const { user, token } = CONFIG.jira;
    return Utilities.base64Encode(`${user}:${token}`);
  }

  /**
   * Returns the options object for making HTTP requests.
   * @param {string} method - The HTTP method (e.g., GET, POST, DELETE).
   * @param {object} payload - The request payload.
   * @returns {object} The options object.
   */
  getOptions(method, payload) {
    return {
      method: method,
      headers: this._defaultHeaders,
      payload: JSON.stringify(payload),
    };
  }

  /**
   * Retrieves an issue by its key.
   * @param {string} issueKey - The key of the issue to retrieve.
   * @returns {object} The result object containing the retrieved issue data.
   */
  getIssue(issueKey) {
    try {
      const url = `${this._baseUrl}/issue/${issueKey}`;
      const response = UrlFetchApp.fetch(url, this.getOptions("GET"));
      const data = JSON.parse(response.getContentText());

      const result = {
        ok: true,
        error: undefined,
        data: data,
      };

      return result;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Creates a new issue.
   * @param {object} createIssueParams - The parameters for creating the issue.
   * @param {object} createIssueParams.fields - The one You get using IssueFieldsHandler.getFieldsObject().
   * @returns {object} The result object containing the created issue data.
   */
  createIssue(createIssueParams) {
    try {
      const url = `${this._baseUrl}/issue`;
      const response = UrlFetchApp.fetch(url, this.getOptions("POST", createIssueParams));
      const data = JSON.parse(response.getContentText());

      const result = {
        ok: true,
        error: undefined,
        data: data,
      };

      return result;
    } catch (error) {
      Logger.log(JSON.stringify(createIssueParams, null, 2));

      return this._handleError(error);
    }
  }

  /**
   * Deletes an issue by its key.
   * @param {string} issueKey - The key of the issue to delete.
   * @returns {object} The result object indicating the success of the deletion.
   */
  deleteIssue(issueKey) {
    try {
      const url = `${this._baseUrl}/issue/${issueKey}`;
      UrlFetchApp.fetch(url, this.getOptions("DELETE"));

      const result = {
        ok: true,
        error: undefined,
        data: undefined,
      };

      return result;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Searches for users by their email.
   * @param {string} userEmail - The email of the user to search for.
   * @returns {object} The result object containing the matched users.
   */
  getUsersByEmail(userEmail) {
    try {
      const url = `${this._baseUrl}/user/search?query=${userEmail}`;
      const response = UrlFetchApp.fetch(url, this.getOptions("GET"));
      const data = JSON.parse(response.getContentText());

      const result = {
        ok: true,
        data: data,
        error: undefined,
      };

      return result;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Adds a user as a watcher to an issue.
   * @param {object} param0 - The parameters for adding the user as a watcher.
   * @param {string} param0.accountId - The account ID of the user.
   * @param {string} param0.issueKey - The key of the issue.
   * @returns {object} The result object indicating the success of adding the watcher.
   */
  addUserAsWatcher({ accountId, issueKey }) {
    try {
      const url = `${this._baseUrl}/issue/${issueKey}/watchers`;
      UrlFetchApp.fetch(url, this.getOptions("POST", accountId));

      const result = {
        ok: true,
        error: undefined,
        data: undefined,
      };

      return result;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Handles errors that occur during API requests.
   * @param {Error} error - The error object.
   * @returns {object} The result object indicating the error.
   * @private
   */
  _handleError(error) {
    let jiraError;

    if (error.data && error.statusCode !== 401) {
      jiraError = JSON.parse(error.data);
    }

    const result = {
      ok: false,
      error: jiraError || String(error),
      data: undefined,
    };

    return result;
  }
}

/**
 * This class handles the complexity of populating the issue fields
 */
class IssueFieldsHandler {
  constructor() {
    this._fieldsObject = {
      description: {
        type: "doc",
        version: 1,
        content: [],
      },
    };
  }

  /**
   * Returns the fields object.
   * @returns {object} The fields object.
   */
  getFieldsObject() {
    return this._fieldsObject;
  }

  /**
   * Retrieves the value of a custom field.
   * @param {string} customFieldId - The ID of the custom field.
   * @returns {any} The value of the custom field.
   */
  getCustomField(customFieldId) {
  }

  /**
   * Sets the issue key.
   * @param {string} issueKey - The issue key.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setIssueKey(issueKey) {
    this._issueKey = issueKey;
    return this;
  }

  /**
   * Sets the value of a custom field.
   * @param {string} customFieldId - The ID of the custom field.
   * @param {any} value - The value to set for the custom field.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setCustomField(customFieldId, value) {
    this._fieldsObject[`customfield_${Number(customFieldId)}`] = value;
    return this;
  }

  /**
   * Sets the project key.
   * @param {string} projectKey - The project key.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setProject(projectKey) {
    this._fieldsObject.project = {
      key: projectKey,
    };
    return this;
  }

  /**
   * Sets the issue type.
   * @param {string} issueTypeName - The name of the issue type.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setIssueType(issueTypeName) {
    this._fieldsObject.issuetype = {
      name: String(issueTypeName),
    };
    return this;
  }

  /**
   * Sets the summary.
   * @param {string} summary - The summary.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setSummary(summary) {
    this._fieldsObject.summary = summary;
    return this;
  }

  /**
   * Adds a component to the issue.
   * @param {string} componentName - The name of the component.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  addComponent(componentName) {
    if (!this._fieldsObject.components) {
      this._fieldsObject.components = [];
    }

    this._fieldsObject.components.push({
      name: componentName,
    });

    return this;
  }

  /**
   * Sets the components of the issue.
   * @param {...string} componentsNames - The names of the components.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  setComponents(...componentsNames) {
    if (!this._fieldsObject.components) {
      this._fieldsObject.components = [];
    }

    this._fieldsObject.components = componentsNames.map((componentName) => ({
      name: componentName,
    }));

    return this;
  }

  /**
   * Opens a new paragraph in the description.
   * @returns {IssueDescriptionParagraphHandler} The instance of IssueDescriptionParagraphHandler.
   */
  openDescriptionParagraph() {
    return new IssueDescriptionParagraphHandler(this);
  }

  /**
   * Adds a ruler to the description.
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  addDescriptionRuler() {
    this._fieldsObject.description.content.push({
      type: "rule",
    });

    return this;
  }

  /**
   * Adds a code block to the description.
   * @param {string} text - The code block text.
   * @param {string} language - The language of the code block (default: "none").
   * @returns {IssueFieldsHandler} The current instance of IssueFieldsHandler.
   */
  addCodeBlock(text, language = "none") {
    this._fieldsObject.description.content.push({
      type: "codeBlock",
      attrs: {
        language,
      },
      content: [
        {
          type: "text",
          text: text || " ",
        },
      ],
    });

    return this;
  }

  /**
   * Adds content to the description.
   * @param {object} content - The content to add to the description.
   * @private
   */
  _addDescriptionContent(content) {
    this._fieldsObject.description.content.push(content);
  }
}

class IssueDescriptionParagraphHandler {
  /**
   * Creates an instance of IssueDescriptionParagraphHandler.
   * @param {IssueFieldsHandler} issueFieldsHandler - The parent IssueFieldsHandler instance.
   */
  constructor(issueFieldsHandler) {
    this._issueFieldsHandler = issueFieldsHandler;
    this._issueDescriptionContent = {
      type: "paragraph",
      content: [],
    };
  }

  /**
   * Closes the paragraph and returns the parent IssueFieldsHandler instance.
   * @returns {IssueFieldsHandler} The parent IssueFieldsHandler instance.
   */
  closeParagraph() {
    this._issueFieldsHandler._addDescriptionContent(
      this._issueDescriptionContent
    );

    return this._issueFieldsHandler;
  }

  /**
   * Adds italicized text to the issue description content.
   * @param {string} text - The text to be displayed as italicized.
   * @returns {IssueDescriptionParagraphHandler} The current instance of the IssueDescriptionParagraphHandler.
   */
  addItalicText(text) {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "em" }],
    });

    return this;
  }

  /**
   * Adds bold text to the issue description content.
   * @param {string} text - The text to be displayed as bold.
   * @returns {IssueDescriptionParagraphHandler} The current instance of the IssueDescriptionParagraphHandler.
   */
  addBoldText(text) {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "strong" }],
    });

    return this;
  }

  /**
   * Adds a link to the issue description content.
   * @param {string} text - The text to be displayed for the link.
   * @param {string} url - The URL of the link.
   * @returns {IssueDescriptionParagraphHandler} The current instance of the IssueDescriptionParagraphHandler.
   */
  addLink(text, url) {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "link", attrs: { href: url || " " } }],
    });

    return this;
  }

  /**
   * Adds normal text to the issue description content.
   * @param {string} text - The text to be displayed normally.
   * @returns {IssueDescriptionParagraphHandler} The current instance of the IssueDescriptionParagraphHandler.
   */
  addNormalText(text) {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
    });

    return this;
  }

  /**
   * Opens a code block within the issue description content.
   * @param {string} [language="none"] - The language associated with the code block.
   * @returns {CodeBlockHandler} A new instance of the CodeBlockHandler to manage the code block.
   */
  openCodeBlock(language = "none") {
    const codeBlockContent = {
      type: "codeBlock",
      attrs: {
        language,
      },
      content: [],
    };

    this._issueFieldsHandler._addDescriptionContent(codeBlockContent);

    return new CodeBlockHandler(this, codeBlockContent);
  }
}

/**
 * A helper class to manage a code block within the issue description content.
 */
class CodeBlockHandler {
  constructor(issueDescriptionParagraphHandler, codeBlockContent) {
    this._issueDescriptionParagraphHandler = issueDescriptionParagraphHandler;
    this._codeBlockContent = codeBlockContent;
  }

  /**
   * Closes the code block and returns the parent IssueDescriptionParagraphHandler.
   * @returns {IssueDescriptionParagraphHandler} The parent IssueDescriptionParagraphHandler instance.
   */
  closeCodeBlock() {
    return this._issueDescriptionParagraphHandler.closeParagraph();
  }

  /**
   * Adds a line of code to the code block.
   * @param {string} line - The line of code to be added.
   * @returns {CodeBlockHandler} The current instance of the CodeBlockHandler.
   */
  addLineOfCode(line) {
    this._codeBlockContent.content?.push({
      type: "text",
      text: line || " ",
    });

    return this;
  }
}
