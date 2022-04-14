<template>
  <div>
    <div class="adding"><input type='image' id='addIcon' alt='Post' :src='require("@/assets/add.png")' v-if='!createPost' @click='createPost=true'><br><small v-if='!createPost'>new post</small></div>
    <br v-if='!createPost'>
    <div v-if='createPost'>
      <h2 style="text">Add new post</h2>
      <div class='container'>
        <div class='upload-container'>
          <input class='upload-item' id='upload-image' img='@/assets/image.png' type='file' accept='image/*' name='photo' @change='fileChanged'>
          <textarea class='upload-item' id='description' v-model='description' placeholder="short paragraph about your post"></textarea>
          <div id='controlBox'>
            <input class='controls' type='image' :src='require("@/assets/cancel.png")' @click='createPost=false'>
            <input class='controls' type='image' alt='Upload' :src='require("@/assets/check.png")' @click='upload'>
            <br><br><br><br>
          </div>
          <div v-if='addItem'>
            <img id='preview' :src='addItem.path'/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Upload',
  data() {
    return {
      description: "",
      file: null,
      addItem: null,
      posts: [],
      findPost: null,
      createPost: false,
      error: false
    }
  },
  computed: {
    user: function() {
      return this.$root.$data.user;
    }
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        this.error = false;
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/posts', {
          user: this.user,
          description: this.description,
          path: r1.data.path
        });
        this.addItem = r2.data;
        this.file = null;
        this.$router.go();
      } catch (error) {
        console.log(error);
        this.error=true;
      }
    },
  }
}
</script>


<style scoped>
#preview {
  max-width: 100%;
}


#controlBox {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

#description {
  width: 100%;
  height: 100px;
}

.container {
  display: flex;
  justify-content: center;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-item {
  margin-top: 20px;
}

.error {
  border: 1px solid red;
}

#addIcon {
  margin: 20px;
  margin-bottom: -10px;
  width: 50px;
}
</style>