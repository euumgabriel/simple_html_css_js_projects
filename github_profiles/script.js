const API_URL = "https://api.github.com/users/";

const searchUserForm = document.getElementById("search-user-form");
const searchUserInput = document.getElementById("search-user-input");
const userProfileContainer = document.getElementById("user-profile-container");

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);

    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status === 404) {
      alert("User not found");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + "/repos?sort=created");

    addReposToCard(data);
  } catch (error) {
    console.log(error);
    alert("Problem fetching repos");
  }
}

function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";

  const cardHTML = `
  <section id='user-card'>
    <figure id='profile-picture-container'>
        <img id='picture' src='${user.avatar_url}' alt='${user.name}'>
    </figure>

    <section id='user-info-container'>
        <h2>${userID}</h2>
        <p>${userBio}</p>

        <ul>
            <li>${user.followers} Followers</li>
            <li>${user.following} Following</li>
            <li>${user.public_repos} Repos</li>
        </ul>
    </section>

    <section id='repos-container'></section>
  </section>
  `;

  userProfileContainer.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposContainer = document.getElementById("repos-container");

  repos.slice(0, 5).forEach((repo) => {
    const repoHTML = document.createElement("a");
    repoHTML.classList.add("repo");
    repoHTML.href = repo.html_url;
    repoHTML.target = "_blank";
    repoHTML.innerText = repo.name;

    reposContainer.append(repoHTML);
  });
}

searchUserForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = searchUserInput.value;

  if (username) {
    getUser(username);

    searchUserInput.value = "";
  }
});
