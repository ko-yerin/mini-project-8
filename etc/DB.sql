CREATE database project8;

use project8;

CREATE TABLE user(
    userid VARCHAR(15) NOT NULL PRIMARY KEY,
    userpw VARCHAR(20) NOT NULL,
    username VARCHAR(15) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    birth VARCHAR(8) NOT NULL, //숫자가 아닌 문자
    gender CHAR(2) NOT NULL,  //이거아님 이거로 고정적으로 들어가니 CHAR로 해주면 될듯
    tell VARCHAR(11) NOT NULL,    //숫자가 아닌 문자 
    email VARCHAR(30) NOT NULL,
    address VARCHAR(50) NOT NULL
    level INT NOT NULL DEFAULT 3
);

CREATE TABLE board(
    idx INT auto_increment PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    story TEXT NOT NULL
);



INSERT INTO board(idx,subject,nickname,story) values (1,'test','mini','hello');

INSERT INTO user(userid,userpw,username,nickname,birth,gender,tell,email,address) values('rhdpfls12','1234','고예린','소고기','940426','여','010123456','rhdpfls12@naver.com','경기도 하남시');
