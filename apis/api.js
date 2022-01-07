import request from '../utils/request';

function uniUploadImage(filePath, type) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('V1/alibaba/face/'+type),
            filePath: filePath,
            name: 'image',
            header: request.buildHeader({}),
            success: (uploadRes) => {
                resolve(uploadRes)
            },
            fail: (failRes) => {
                reject(failRes)
            }
        });
    })
}

function imageSecCheck(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('V1/image/sec-check/'),
            filePath: filePath,
            name: 'image',
            header: request.buildHeader({}),
            success: (uploadRes) => {
                resolve(uploadRes)
            },
            fail: (failRes) => {
                reject(failRes)
            }
        });
    })
}


export {
    uniUploadImage, imageSecCheck
}
