<template>
  <div class="biography">
    <div class="profile">
      <img class="avator" src="https://source.unsplash.com/random/100x100" alt="" />
      <div class="meta">
        <strong class="uname">John Doe</strong>
        <div class="contact-links">
          <i class="fas fa-camera"></i>
          <i class="fas fa-camera"></i>
          <i class="fas fa-camera"></i>
        </div>
      </div>
    </div>
    <div class="desc">
      This is the profile widget. Here you can set your profile image, name, bio, and social links (maximum 7).
    </div>
  </div>
</template>

<style lang="scss">
.biography {
  display: flex;
  flex-direction: column;

  .desc {
    color: #666;
    font-size: 1.3rem;
    margin-top: 20px;
  }

  @media screen and (max-width: 980px) {
    .profile {
      justify-content: space-between;
    }
  }

  .profile {
    display: flex;
    align-items: center;

    .avator {
      border-radius: 50px;
      border: 1px solid grey;
      width: 100px;
      height: 100px;
      margin-right: 18px;
    }

    .meta {
      display: flex;
      flex-direction: column;

      .uname {
        font-size: 1.3rem;
        line-height: 1.8rem;
        margin-bottom: 10px;
      }

      .contact-links {
        display: flex;
        justify-content: space-around;

        i {
          padding: 0 6px;
        }
      }
    }
  }
}
</style>