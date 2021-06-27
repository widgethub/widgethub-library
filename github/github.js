var widget = {
  options: {
    id: "",
    API_URL:"https://widget.discoursevr.space/",
    theme: 
    {
      background1: "indigo-800",
      background2: "blue-800",
      titleColor: "indigo-50",
      titleHoverColor: "red-500",
      descriptionColor: "gray-300"
    },
    edges: true,
    customMessage: "",
    targetId: "widgethub-githubdiv"
  },
  targetHtmlEle: "",
  messages: {
    missingId: "userid is invalid",
    missingTargetHtml: "not found html element with specified id",
    missingParams: "not enough params",
    errorFetching: "Error fetching data from remote url"
  },
  setOptions: function(options) {
    if (options.id) {
      this.options.id = options.id;
    }
    if (options.theme) {
      this.options.theme = options.theme
    }

    if (options.edges) {
      this.options.edges = options.edges;
    }

    if (options.customMessage) {
      this.options.customMessage = options.customMessage;
    }

  },
  validate: function () {
    if (!this.options.id) {
      console.log(this.messages.missingId);
    }
    this.targetHtmlEle = document.getElementById(this.options.targetId);
    if(!this.targetHtmlEle) {
        console.log(this.messages.missingTargetHtml);
        return false;
    }
    return true;
  },
  render: async function() {
    if (!this.validate()) {
      return;
    }

    // Loader gif
    this.targetHtmlEle.innerHTML = '<img class="widgethub-github" src="https://i.pinimg.com/originals/df/d2/68/dfd2683c9701642c776e31d3b0d603a9.gif" />';

    //this.applyCSS();
      this.targetHtmlEle.innerHTML = this.template(await this.fetch());


  },
  fetch: function() {
    const data = JSON.stringify({
      query: `query MyQuery {
        getGithubUser(username:"${this.options.id}"){
          username
          followers
          following
          repoCount
          avatarUrl
          pastYearContributions
        }
     }`
    })
    //callback(message)
    return fetch(this.options.API_URL+"graphql", 
      {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      } 
      )
      .then((res) => res.json())
      .catch(err => console.log(err,"error fetching"))

  },
  template: function(response) {
    console.log(response);
    response = response.data.getGithubUser;
    theme = this.options.theme;
    logo = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    var html = '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">';


    html+= `

<div class="max-w-xs">
    <div class="bg-gradient-to-r from-${theme.background1} to-${theme.background2} shadow-xl rounded-2xl py-3">
        <div class="photo-wrapper p-2">
            <img class="w-32 h-32 rounded-full mx-auto" src="${response.avatarUrl}" alt="Avatar">
        </div>
        <div class="p-2">
          <div class="flex items-center justify-center">
            <img class="w-6 h-6 rounded-full m-1" src="${logo}" alt="Logo">
            <h3 class="text-center text-xl text-${theme.titleColor} 
            font-medium leading-8 hover:text-${theme.titleHoverColor}"
             ><a href="https://github.com/${response.username}" target="_blank">${response.username}</a></h3>
          </div>
            `

    if (this.options.customMessage !== "") {
      html+=`<div class="text-center text-${theme.descriptionColor} text-xs font-semibold">
           <p>${this.options.customMessage}</p>
            </div>`
    }
    html+=` 
            <table class="text-xs mt-2">
                <tbody><tr>
                    <td class="px-2 py-2 text-${theme.titleColor} font-bold">Followers</td>
                    <td class="px-2 py-2 text-${theme.descriptionColor}">${response.followers}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 text-${theme.titleColor} font-bold">Following</td>
                    <td class="px-2 py-2 text-${theme.descriptionColor}">${response.following}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 text-${theme.titleColor} font-bold">Repository Count</td>
                    <td class="px-2 py-2 text-${theme.descriptionColor}">${response.repoCount}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 text-${theme.titleColor} font-bold">Past Year Contributions</td>
                    <td class="px-2 py-2 text-${theme.descriptionColor}">${response.pastYearContributions}</td>
                </tr>
 
            </tbody></table>

        </div>
    </div>
</div>`
    return html;

  },
  applyCss: function() {

  }
}

