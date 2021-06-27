var widget = {
  options: {
    id: "",
    API_URL:"https://widget.discoursevr.space/",
    information: {
      username: true,
      followers: false,
      following: false,
      repocount: false,
      pastyearcontributions: false
    },
    theme: 
      {
        background: "bg-indigo-600",
        titleColor: "#000",
        dateColor: "#dadada",
        imgBorderColor: "#ddd",
        descriptionColor: "#000"
    }
    ,
    edges: true,
    size: [100,100],
    targetId: "widgethub-githubdiv"
  },
  targetHtmlEle: "",
  messages: {
    missingId: "userid is invalid",
    missingTargetHtml: "not found html element with specified id",
    missingParams: "not enough params",
    errorFetching: "Error fetching data from remote url"
  },
  themes: {
    default: {
        background: "bg-indigo-600",
        titleColor: "#000",
        dateColor: "#dadada",
        imgBorderColor: "#ddd",
        descriptionColor: "#000"
    },
    blue: {
        background: "bg-gradient-to-r from-indigo-800 to-blue-800",
        titleColor: "text-indigo-50",
        headerColor: "text-pink-600",
        header2Color: "text-red-500",
        descriptionColor: "text-gray-300"
    },
    green: {
        background: "#10d010",
        titleColor: "#fff",
        dateColor: "#b90404",
        imgBorderColor: "#a97e1d",
        descriptionColor: "#000"
    },
    purple: {
        background: "#6310d0",
        titleColor: "#fff",
        dateColor: "#f7f3f3",
        imgBorderColor: "#a97e1d",
        descriptionColor: "#000"
    },
    dark: {
        background: "#000",
        titleColor: "#fff",
        dateColor: "#f7f3f3",
        imgBorderColor: "#a97e1d",
        descriptionColor: "#fff"
    }
  },
  setOptions: function(options) {
    if (options.id) {
      this.options.id = options.id;
    }
    if (options.theme) {
      console.log(options.theme)
      this.options.theme = this.themes[options.theme];
      console.log(this.options.theme)
    }

    if (options.edges) {
      this.options.edges = options.edges;
    }

    if (options.size) {
      this.options.size = options.size;
    }
    // information:

    if (options.information) {
      this.options.information = options.information;
    }
  },
  validate: function () {
    if (!this.options.id) {
      console.log(this.messages.missingId);
    }
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
        getUser(username:"${this.options.id}"){
          username
          followers
          following
          repoCount
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
    console.log(response)
    response = response.data.getUser
    var html = '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">';


    html+= `<div class="flex items-center">

<div class="max-w-xs">
    <div class="${this.options.theme.background} shadow-xl rounded-2xl py-3">
        <div class="photo-wrapper p-2">
            <img class="w-32 h-32 rounded-full mx-auto" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="John Doe">
        </div>
        <div class="p-2">
            <h3 class="text-center text-xl ${this.options.theme.titleColor} font-medium leading-8">${response.username}</h3>
            <div class="text-center ${this.options.theme.descriptionColor} text-xs font-semibold">
                <p>Web Developer</p>
            </div>
            <table class="text-xs my-3">
                <tbody><tr>
                    <td class="px-2 py-2 ${this.options.theme.titleColor} font-bold">Followers</td>
                    <td class="px-2 py-2 ${this.options.theme.descriptionColor}">${response.followers}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 ${this.options.theme.titleColor} font-bold">Following</td>
                    <td class="px-2 py-2 ${this.options.theme.descriptionColor}">${response.following}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 ${this.options.theme.titleColor} font-bold">Repository Count</td>
                    <td class="px-2 py-2 ${this.options.theme.descriptionColor}">${response.repoCount}</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 ${this.options.theme.titleColor} font-bold">Past Year Contributions</td>
                    <td class="px-2 py-2 ${this.options.theme.descriptionColor}">${response.pastYearContributions}</td>
                </tr>
 
            </tbody></table>

            <div class="text-center my-3">
                <a class="text-xs ${this.options.theme.headerColor} hover:${this.options.theme.header2Color} font-medium" href="https://github.com/${response.username}" target="_blank">View Profile</a>
            </div>

        </div>
    </div>
</div>

</div>`
    return html;

  },
  applyCss: function() {

  }
}

