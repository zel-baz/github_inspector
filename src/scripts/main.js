// User info section elements
const userPicTag = document.querySelector(".user-info-section .user-pic img");
const userNameTag = document.querySelector(".user-info-section .user-name");
const userBioTag = document.querySelector(".user-info-section .user-bio");
const followersTag = document.querySelector(".user-info-section .followers span");
const followingTag = document.querySelector(".user-info-section .following span");
const userLocationTag = document.querySelector(".user-info-section .location span");
const totalReposTag = document.querySelector(".user-info-section .repos span");
const userGithubProfile = document.querySelector(".user-info-section .user-profile");

// for error section
const errorSection = document.querySelector(".error-section");
const closeError = errorSection.querySelector("button.close");
closeError.addEventListener("click", () => {
    errorSection.classList.remove("active");
})

const defaultUser = 'zel-baz';
window.onload = ()=>{
    getUserInfo(defaultUser);
    getUserRepos(defaultUser);
}

let searchBtn = document.querySelector(".search button");
searchBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    const username = document.querySelector(".search input").value;
    getUserInfo(username);
    getUserRepos(username);
})

// User's repos elements
const reposContainer = document.querySelector(".profile .repos-info-section");





async function getUserInfo(username){
    try{
        const response = await fetch(`https://api.github.com/users/${username}`);
        if(!response.ok){
            throw new Error('User not found!');
        }
        const info = await response.json();
        showUserInfo(info);
    }catch(error){
        errorSection.querySelector(".error").textContent = `Error: ${error}`;
        errorSection.classList.add("active");
    }
}


function showUserInfo(info) {
    userPicTag.src = info.avatar_url
    userNameTag.textContent = info.name;
    userBioTag.textContent = info.bio || 'No bio available';
    userLocationTag.textContent = info.location || 'Not available';
    totalReposTag.textContent = info.public_repos;
    userGithubProfile.href = info.html_url;
    followersTag.textContent = info.followers;
    followingTag.textContent = info.following;
}







async function getUserRepos(username){
    try{
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if(!response.ok){
            throw new Error('Error fetching repos');
        }
        const reposInfo = await response.json();
        showReposInfo(reposInfo);
    }catch(error){
        errorSection.querySelector(".error").textContent = `Error: ${error}`;
        errorSection.classList.add("active");
    }
}

function checkDescription(desc, maxLen){
    if(!desc){
        return desc
    }
    if(desc.length > maxLen){
        return desc.slice(0, maxLen)+'...';
    }
    return desc
}


function showReposInfo(repo){
    reposContainer.innerHTML = '';
    repo.forEach((repo, index)=>{
        reposContainer.innerHTML += `
<div class="repo-box">
    <div class="repo-pic">
        <img src="https://picsum.photos/300/300?random=${index}">
    </div>
    <p class="repo-name">${repo.name}</p>
    <p class="repo-description">${checkDescription(repo.description, 150) || 'No description'}</p>
    <div class="actions">
        <div class="info">
            <div class="stars">
                <i class="far fa-star"></i>
                ${repo.stargazers_count}
            </div>
            <div class="forks">
                <i class="fas fa-code-branch"></i>
                ${repo.forks_count}
            </div>
        </div>
        <a target="_blank" href="${repo.html_url}" class="repo-link">Visit</a>
    </div>
</div>
        `;
    });
}
