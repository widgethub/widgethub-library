var widget = {
  options: {
    id: "",
    API_URL:"https://api.widgethub.space/",
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
    div: "widgethub-githubdiv"
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

    if (options.div) {
      this.options.div = options.div;
    }

  },
  validate: function () {
    if (!this.options.id) {
      console.log(this.messages.missingId);
    }
    this.targetHtmlEle = document.getElementById(this.options.div);
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
          pinnedRepos {
            name
            url
            forkCount
            starCount
            language
            languageColor
          }
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

    const starSvg=`
      <svg aria-label="stars" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-star">
          <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
      </svg>
    `
    const forkSvg=`
      <svg aria-label="forks" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-repo-forked">
        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
      </svg>
    `

    html+= `
<div class="flex items-center"> 
  <div class="">
    <div class="bg-gradient-to-r from-${theme.background1} to-${theme.background2} shadow-xl rounded-bl-2xl rounded-tr-2xl py-3 px-3">

      <div class="header-bar p-2 flex item-center">
          <img class="w-8 h-8 rounded-full mr-4" src="${response.avatarUrl}" alt="Avatar">
          <h2 class="text-center text-xl text-${theme.titleColor} font-medium leading-8 hover:text-${theme.titleHoverColor}" >
            <a class="transition-colors" href="https://github.com/${response.username}" target="_blank">${response.username} | github spotlight</a>
          </h3>
      </div>
      
      <div class="p-2 grid grid-cols-2 gap-4">
      `

      response.pinnedRepos.map(repo => {
        html+=`
        <div class="bg-white rounded-xl shadow-xl transition-colors group hover:bg-gray-100 hover:shadow-inner">

          <a href="${repo.url}">
            <div class="m-3">
              <div class="flex items-center justify-between">
                <div class="mr-5">
                  <p class="font-semibold">${repo.name}</p>
                </div>
                <div class="flex items-center select-none">
                  ${starSvg} ${repo.starCount} ${forkSvg} ${repo.forkCount}
                </div>
              </div>
              <div class="flex items-center">
                <p style="border-color: ${repo.languageColor}" class="w-1 rounded-2xl border-8 mr-2"></p>
                ${repo.language}
              </div>
            </div>
          </a>
        </div> 
        `
      })
      
    html+=`
      </div>

    </div>
  </div>
</div>
`
    return html;

  },
  applyCss: function() {

  }
}

