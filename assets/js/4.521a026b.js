(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{322:function(t,e,a){t.exports=a.p+"assets/img/GitHub_new_repo.6749c4e6.png"},323:function(t,e,a){t.exports=a.p+"assets/img/GitHub_clone_repo.da9c535c.png"},328:function(t,e,a){"use strict";a.r(e);var o=a(33),n=Object(o.a)({},(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[o("h1",{attrs:{id:"push-a-project-up-to-github"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#push-a-project-up-to-github"}},[t._v("#")]),t._v(" Push a Project up to GitHub")]),t._v(" "),o("p",[o("a",{attrs:{href:"https://github.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitHub"),o("OutboundLink")],1),t._v(" is a platform for hosting source code using "),o("a",{attrs:{href:"https://git-scm.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("git"),o("OutboundLink")],1),t._v(" for source control. "),o("a",{attrs:{href:"https://expandedramblings.com/index.php/github-statistics/",target:"_blank",rel:"noopener noreferrer"}},[t._v("A lot of people use it."),o("OutboundLink")],1)]),t._v(" "),o("p",[t._v("It's free to use and allows you to keep your code online and integrates with a ton of other services. It's the default place to put your code if you're wanting to start a new codebase (a couple others are "),o("a",{attrs:{href:"https://about.gitlab.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("GitLab"),o("OutboundLink")],1),t._v(" and "),o("a",{attrs:{href:"https://bitbucket.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bitbucket"),o("OutboundLink")],1),t._v(").")]),t._v(" "),o("h2",{attrs:{id:"create-a-github-account"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#create-a-github-account"}},[t._v("#")]),t._v(" Create a GitHub account")]),t._v(" "),o("p",[t._v("First, we'll want to create a GitHub account if you don't already have one. Go to "),o("a",{attrs:{href:"https://github.com/join",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/join"),o("OutboundLink")],1),t._v(" to do that.")]),t._v(" "),o("h2",{attrs:{id:"make-a-new-repository"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#make-a-new-repository"}},[t._v("#")]),t._v(" Make a New Repository")]),t._v(" "),o("p",[t._v("Once you have a GitHub account, you can create a new repository in your account by going to "),o("a",{attrs:{href:"https://github.com/new",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/new"),o("OutboundLink")],1),t._v(" and then filling out the form. Make it anything you want, but it should look something like this:")]),t._v(" "),o("p",[o("img",{attrs:{src:a(322),alt:"GitHub New Repo Example"}})]),t._v(" "),o("h2",{attrs:{id:"clone-your-repo-to-your-machine"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#clone-your-repo-to-your-machine"}},[t._v("#")]),t._v(" Clone Your Repo to Your Machine")]),t._v(" "),o("p",[t._v("Once you've created your repo, you should be able to see a \"Clone or download\" button in the top right of the repo's page. Like this:")]),t._v(" "),o("p",[o("img",{attrs:{src:a(323),alt:"GitHub Clone Button Example"}})]),t._v(" "),o("p",[t._v("Click that, copy the url that pops up, and then execute this command in your terminal:")]),t._v(" "),o("div",{staticClass:"language-bash extra-class"},[o("pre",{pre:!0,attrs:{class:"language-bash"}},[o("code",[o("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/"),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("username"),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("/"),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("project_name"),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(".git "),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("project_name"),o("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),o("p",[t._v("For example:")]),t._v(" "),o("div",{staticClass:"language-bash extra-class"},[o("pre",{pre:!0,attrs:{class:"language-bash"}},[o("code",[o("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/mcmillenb/dnd-party-manager.git dnd-party-manager\n")])])]),o("p",[t._v('This will "clone" your repo into a directory ('),o("code",[t._v("dnd-party-manager")]),t._v(" in my example), which effectively copies all of the files in the repo to that directory and initialize git with the entire history of your project.")]),t._v(" "),o("h2",{attrs:{id:"push-a-change-to-github"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#push-a-change-to-github"}},[t._v("#")]),t._v(" Push a Change to GitHub")]),t._v(" "),o("p",[t._v("Now that you've gotten your repo code cloned onto your machine, make a change to a file (the "),o("code",[t._v("README.md")]),t._v(" file for example) and then execute the following commands in your terminal:")]),t._v(" "),o("div",{staticClass:"language-bash extra-class"},[o("pre",{pre:!0,attrs:{class:"language-bash"}},[o("code",[o("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" "),o("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),t._v(" "),o("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(".")]),t._v("\n"),o("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" commit -m "),o("span",{pre:!0,attrs:{class:"token string"}},[t._v('"update the README.md file"')]),t._v("\n"),o("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" push\n")])])]),o("p",[t._v("This should push the change up to GitHub, and you should be able to see the change when you visit your project's url again.")])])}),[],!1,null,null,null);e.default=n.exports}}]);