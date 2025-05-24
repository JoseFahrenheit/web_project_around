export class UserInfo {
  constructor({ userNameSelector, userJobSelector, userAvatarSelector }) {
    this._userNameElement = document.querySelector(userNameSelector);
    this._userJobElement = document.querySelector(userJobSelector);
    this._userAvatarElement = document.querySelector(userAvatarSelector);
  }

  getUserInfo() {
    return {
      name: this._userNameElement.textContent,
      job: this._userJobElement.textContent,
      avatar: this._userAvatarElement.src
    };
  }

  setUserInfo({ name, job, avatar }) {
    this._userNameElement.textContent = name;
    this._userJobElement.textContent = job;
    if (avatar) {
      this._userAvatarElement.src = avatar;
    }
  }
}