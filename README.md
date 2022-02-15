# Presentation remix

Presentation remix is a set of programs that allow an organization to have various presentations where chunks of the slides are re-used. Those slides will always be served from the source and in the various presentations there are links to those slides.

The software used: reveal.js, rdf-form, Chrome developer version (new API: file handling API).

## Components

- Server, API that exposes the presentation data.
- Editor, a desktop PWA that enables you to edit presentations.
- Client, a static HTML site that uses the API the show the presentations.

### Server

In the folder /server there is a Deno script that serves up an API given a folder with presentations. 

You can host this server. You could also build the server with something else. In our own use case we are using Sharepoint. This enables us to centralize the files with the sync of Sharepoint. We have made some Power Automate flows that are then hooked into the client. See client. 

### Client

The client application is a static HTML website that reads the API paths and renders all that is needed.
The homepage serves up the list of known presentations. Clicking on any of the links shows the Reveal.js presentation.

You should but this on a domain, it can not be placed into a sub folder.

Example: `presentations.your-organization.com`

The API paths are configurable. Just edit the index.html that you serve.
You will find documentation what and how to edit inside the index.html.

### Editor

The editor is organization agnostic. You can install it with the Chrome browser. Open up pres-remix.danielbeeke.nl. Follow the steps in the wizard.

It will install a desktop PWA on your machine with settings that map to your organization. These settings should be hosted somewhere. A special prefilled link can be made so coworkers can easily install the editor.