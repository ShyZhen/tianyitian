function getShareObj(res) {
    return {
        title: getShareMessage(),
        desc: '你想要的样子我都有',
        imageUrl: '/static/image/mask/avatar_mask.jpg',
        path: '/pages/index/index',
        success(res) {
        },
        fail(res) {
        }
    }
}

function getShareMessage() {
    let messages = [{
        title: '添一添,制作自定义头像',
    },{
        title: '限时节日挂件,让您的头像引领潮流',
    },{
        title: '换上口罩头像,防止疫情蔓延',
    },{
        title: '给你的头像加上横幅,不达目的坚决不换',
    }];

    return messages[Math.floor(Math.random()*messages.length)]['title'];
}


export {
    getShareObj
}
