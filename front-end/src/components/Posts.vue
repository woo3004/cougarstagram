<template>
    <div class='posts'>
        <div v-if='posts && users'>
            <div class='post' v-for='post in this.slicedPosts' :key='post._id'>
                <div class="container">
                    <h3 class='username'>{{users[post.user]}}</h3>
                    <img class='image' :src='post.path'/>
                    <div class='likes'>
                        <input class='likeButton' v-if='likeMap[post._id]' @click='like(post._id)' alt='Like' type='image' :src='require("@/assets/liked.png")'>
                        <input class='likeButton' v-else alt='Like' @click='like(post._id)' type='image' :src='require("@/assets/unliked.png")'>
                        <p>{{post.likes}}</p>
                    </div>
                    <div id='description'>{{post.description}}</div>
                    <hr>
                    <input type='image' class='controls' alt='Comments' :src='require("@/assets/comment.png")' @click='getComments(post._id); toggleComments(post._id)'>
                    <br>
                    <small class="com" v-if=!displayComments[post._id]>view or leave a comment</small>
                    <div v-if='displayComments[post._id]'>
                        <div v-if='comments.length != 0'>
                            <div v-for='commentGroup in comments' :key='commentGroup.post'>
                                <div v-if='commentGroup[0].post === post._id'>
                                    <div class='comment' v-for='comment in commentGroup' :key='comment._id'>
                                        <div class="commentBox">
                                        <div id='commentText'>{{comment.text}}</div>
                                        <div id='commentDate'>{{comment.date}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>No comment!</div>
                        <div v-if='user'>
                            <textarea  id='commentBox' v-model='text[post._id]' placeholder='leave a comment'></textarea>
                            <div id='addCommentBox'>
                                <input class='controls' type='image' alt='Comment' :src='require("@/assets/write.png")' @click='addComment(post._id)'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button v-if="this.posts.length > 3" @click='limiter += 2'>Show more</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {   
    name: 'Posts',
    data() {
        return {
            posts: [],
            text: {},
            limiter: 3,
            comments: [],
            displayComments: {},
            users: {},
            likeMap: {},
        }
    },
    async created() {
        await this.getPosts();
        await this.getUsers();
        this.initializeLikeMap();
    },
    computed: {
        limit() {
            if (this.limiter > this.posts.length) return this.posts.length;
            return this.limiter;
        },
        slicedPosts() {
            return this.posts.slice(this.posts.length - this.limit, this.posts.length).reverse();
        },
        user() {
            return this.$root.$data.user
        },
    },
    methods: {
        async getPosts() {
            try {
                let response = await axios.get('/api/posts');
                this.posts = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async getComments(id) {
            try {
                let response = await axios.get('/api/posts/' + id + '/comments');
                if (response.data.length === 0) return;
                if (response.data.length != 0) {
                    if (this.comments.length != 0) {
                        // Check if comments already exist
                        for (let i = 0; i < this.comments.length; i++) {
                            // Add only new comments to post
                            if (this.comments[i][0].post === response.data[0].post) {
                                for (let j = this.comments[i].length; j < response.data.length; j++) {
                                    this.comments[i].push(response.data[j]);
                                }
                                return true;
                            } 
                        }
                    }
                }
                this.comments.push(response.data);
            } catch (error) {
                console.log(error);
            }
        },
        toggleComments(id) {
            this.$set(this.displayComments, id, !this.displayComments[id]);
        },
        async deletePost(id) {
            try {
               await axios.delete('/api/posts/' + id);
               this.getPosts();
               return true;
            } catch (error) {
                console.log(error);
            }
        },
        async addComment(id) {
            try {   
                    if(this.text[id]) {
                        await axios.post('/api/posts/' + id + '/comments', {
                            text: this.text[id],
                            date: moment().format('MM/DD/YYYY, h:mm a'),
                            // user: this.user,
                        });
                        this.getPosts();
                        this.getComments(id);
                        this.text = {};
                    }
                    
            } catch (error) {
                console.log(error);
            }
        },
        async like(id) {
            if (this.likeMap[id] === this.user._id) return;
            try {
                await axios.put('/api/posts/' + id, {
                    user: this.user._id
                });
                this.getPosts();
                this.$set(this.likeMap, id, this.user._id);
            } catch (error) {
                console.log(error);
            }
        },
        initializeLikeMap() {
            this.posts.forEach(post => {
                this.$set(this.likeMap, post._id, post.likedUsers.find(userID => userID == this.user._id))
            })
        },
        async getUsers() {
            try {
                for (let i = 0; i < this.posts.length; i++) {
                    let response = await axios.get('/api/users/' + this.posts[i].user)
                    let user = response.data
                    this.$set(this.users, user._id, user.username)
                }
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
}
</script>

<style scoped>
hr {
    border: 1px solid #cacaca;
    width: 100%;
}
.posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.container {
  padding: 0px 30px 10px 30px;
  border: solid gray 2px;
  border-radius: 15px;
  text-align: left;
  margin-bottom: 30px;
}

/* .com {
    display: flex;
} */

.post {
    display: flex;
    flex-direction: column;
}
.image {
    max-width: 100%;
    border-radius: 15px;
}
.likeButton {
    width: 20px;
    margin-right: 10px;
}
.username {
    margin-right: auto;
}
.likes {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
#trash {
    margin-left: auto;
}
#description {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
}

.commentBox {
    border: solid gray 2px;
    border-radius: 5px;
    padding: 5px;
}


.comment {
    margin-top: 20px;
    text-align: left;
}
#commentDate {
    text-align: right;
    margin-left: 10px;
    font-size: .7em;
    color: #777777;
}
#commentBox {
    margin-top: 20px;
    width: 100%;
    height: 5em;
}
#addCommentBox {
    display: flex;
    width: 100%;
    justify-content: flex-end;
}
</style>
