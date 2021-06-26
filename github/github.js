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
    theme: "light",
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
  },
  setOptions: function(options) {
    if (options.id) {
      this.options.id = options.id;
    }
    if (options.theme) {
      this.options.theme = options.theme;
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
    var html = '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">';


    html+= `<div class="flex items-center">

<div class="max-w-xs">
    <div class="bg-white shadow-xl rounded-lg py-3">
        <div class="photo-wrapper p-2">
            <img class="w-32 h-32 rounded-full mx-auto" src="https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp" alt="John Doe">
        </div>
        <div class="p-2">
            <h3 class="text-center text-xl text-gray-900 font-medium leading-8">${response.name}</h3>
            <div class="text-center text-gray-400 text-xs font-semibold">
                <p>Web Developer</p>
            </div>
            <table class="text-xs my-3">
                <tbody><tr>
                    <td class="px-2 py-2 text-gray-500 font-semibold">Address</td>
                    <td class="px-2 py-2">Chatakpur-3, Dhangadhi Kailali</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                    <td class="px-2 py-2">+977 9955221114</td>
                </tr>
                <tr>
                    <td class="px-2 py-2 text-gray-500 font-semibold">Email</td>
                    <td class="px-2 py-2">john@exmaple.com</td>
                </tr>
            </tbody></table>

            <div class="text-center my-3">
                <a class="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" href="#">View Profile</a>
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

