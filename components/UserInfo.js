export class UserInfo {
  constructor({ userNameSelector, userJobSelector, userAvatarSelector}) {
    this._userNameElement = document.querySelector(userNameSelector);
    this._userJobElement = document.querySelector(userJobSelector);
    this._userAvatarElement = document.querySelector(userAvatarSelector);
    this._userId = null;
  }

  getUserInfo() {
    return {
      name: this._userNameElement.textContent,
      job: this._userJobElement.textContent,
      avatar: this._userAvatarElement.src,
      userId: this._userId
    };
  }

  setUserInfo({ name, job, avatar, userId}) {
    this._userNameElement.textContent = name;
    this._userJobElement.textContent = job;
    if (avatar) {
      this._userAvatarElement.src = avatar;
    }
    if (userId) {
      this._userId = userId;
    }
  }
}