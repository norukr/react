import './App.css';
import { useState, useEffect } from 'react';

function Login(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <h2>로그인</h2>
            <div className="form">
                <p>
                    <input
                        className="login"
                        type="text"
                        name="username"
                        placeholder="아이디"
                        onChange={event => setId(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="login"
                        type="password"
                        name="pwd"
                        placeholder="비밀번호"
                        onChange={event => setPassword(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="btn"
                        type="submit"
                        value="로그인"
                        onClick={() => {
                            const userData = {
                                userId: id,
                                userPassword: password,
                            };

                            fetch("http://localhost:3001/login", {
                                method: "post",
                                headers: {
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(userData),
                            })
                                .then((res) => res.json())
                                .then((json) => {
                                    if (json.isLogin === "True") {
                                        props.setMode("WELCOME");
                                    } else {
                                        alert(json.isLogin);
                                    }
                                });
                        }}
                    />
                </p>
            </div>
            <p>
                계정이 없으신가요? <button onClick={() => props.setMode("SIGNIN")}>회원가입</button>
            </p>
        </>
    );
}

function Signin(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    return (
        <>
            <h2>회원가입</h2>
            <div className="form">
                <p>
                    <input
                        className="login"
                        type="text"
                        placeholder="아이디"
                        onChange={event => setId(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="login"
                        type="password"
                        placeholder="비밀번호"
                        onChange={event => setPassword(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="login"
                        type="password"
                        placeholder="비밀번호 확인"
                        onChange={event => setPassword2(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="btn"
                        type="submit"
                        value="회원가입"
                        onClick={() => {
                            const userData = {
                                userId: id,
                                userPassword: password,
                                userPassword2: password2,
                            };

                            fetch("http://localhost:3001/signin", {
                                method: "post",
                                headers: {
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(userData),
                            })
                                .then((res) => res.json())
                                .then((json) => {
                                    if (json.isSuccess === "True") {
                                        alert('회원가입이 완료되었습니다!');
                                        props.setMode("LOGIN");
                                    } else {
                                        alert(json.isSuccess);
                                    }
                                });
                        }}
                    />
                </p>
            </div>
            <p>
                로그인화면으로 돌아가기 <button onClick={() => props.setMode("LOGIN")}>로그인</button>
            </p>
        </>
    );
}

function CreatePost(props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <>
            <h2>게시물 작성</h2>
            <div className="form">
                <p>
                    <input
                        className="login"
                        type="text"
                        placeholder="제목"
                        onChange={event => setTitle(event.target.value)}
                    />
                </p>
                <p>
                    <textarea
                        className="login"
                        placeholder="내용"
                        onChange={event => setContent(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="btn"
                        type="submit"
                        value="작성"
                        onClick={() => {
                            const postData = {
                                title: title,
                                content: content,
                            };

                            fetch("http://localhost:3001/posts", {
                                method: "post",
                                headers: {
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(postData),
                                credentials: "include",
                            })
                                .then((res) => res.json())
                                .then((json) => {
                                    if (json.isSuccess === "True") {
                                        alert('게시물이 등록되었습니다!');
                                        props.setMode("WELCOME");
                                    } else {
                                        alert('게시물 등록에 실패했습니다.');
                                    }
                                });
                        }}
                    />
                </p>
            </div>
            <p>
                메인 페이지로 돌아가기 <button onClick={() => props.setMode("WELCOME")}>메인</button>
            </p>
        </>
    );
}

function EditPost(props) {
    const [title, setTitle] = useState(props.post.Title);
    const [content, setContent] = useState(props.post.Content);

    return (
        <>
            <h2>게시물 수정</h2>
            <div className="form">
                <p>
                    <input
                        className="login"
                        type="text"
                        value={title}
                        placeholder="제목"
                        onChange={event => setTitle(event.target.value)}
                    />
                </p>
                <p>
                    <textarea
                        className="login"
                        value={content}
                        placeholder="내용"
                        onChange={event => setContent(event.target.value)}
                    />
                </p>
                <p>
                    <input
                        className="btn"
                        type="submit"
                        value="수정"
                        onClick={() => {
                            const postData = {
                                title: title,
                                content: content,
                            };

                            fetch(`http://localhost:3001/posts/${props.post.PostID}`, {
                                method: "PUT",
                                headers: {
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(postData),
                                credentials: "include",
                            })
                                .then((res) => res.json())
                                .then((json) => {
                                    if (json.isSuccess === "True") {
                                        alert('게시물이 수정되었습니다!');
                                        props.setMode("WELCOME");
                                    } else {
                                        alert('게시물 수정에 실패했습니다.');
                                    }
                                });
                        }}
                    />
                </p>
            </div>
            <p>
                메인 페이지로 돌아가기 <button onClick={() => props.setMode("WELCOME")}>메인</button>
            </p>
        </>
    );
}

function App() {
    const [mode, setMode] = useState("");
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/authcheck")
            .then((res) => res.json())
            .then((json) => {
                if (json.isLogin === "True") {
                    setMode("WELCOME");
                } else {
                    setMode("LOGIN");
                }
            });
    }, []);


    const handleLogout = () => {
        fetch("http://localhost:3001/logout", {
            method: "GET",
            credentials: "include"
        })
            .then(() => {
                setMode("LOGIN");
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    const handleDeletePost = (postId) => {
        fetch(`http://localhost:3001/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('게시물 삭제에 실패했습니다');
                }
            })
            .then((json) => {
                if (json.isSuccess === "True") {
                    alert('게시물이 삭제되었습니다!');
                    setPosts(posts.filter(post => post.PostID !== postId));
                } else {
                    alert('게시물 삭제에 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('게시물 삭제 중 에러 발생:', error);
                alert('게시물 삭제 중 에러가 발생했습니다. 관리자에게 문의하세요.');
            });
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        setMode("EDIT");
    };

    let content = null;

    if (mode === "LOGIN") {
        content = <Login setMode={setMode} />;
    } else if (mode === 'SIGNIN') {
        content = <Signin setMode={setMode} />;
    } else if (mode === 'WELCOME') {
        content = (
            <>
                <h2>메인 페이지에 오신 것을 환영합니다</h2>
                <p>로그인에 성공하셨습니다.</p>
                <button onClick={handleLogout}>로그아웃</button>
                <h3>게시판 목록</h3>
                <button onClick={() => {
                    fetch("http://localhost:3001/posts", {
                        method: "GET",
                        headers: {
                            "content-type": "application/json"
                        },
                        credentials: "include"
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            setPosts(json);
                        })
                        .catch((error) => {
                            console.error('Error fetching posts:', error);
                        });
                }}>
                    게시판 목록 조회
                </button>
                <button onClick={() => setMode("CREATE")}>게시물 작성</button>
                <ul>
                    {posts.map((post) => (
                        <li key={post.PostID}>
                            <h4>{post.Title}</h4>
                            <p>{post.Content}</p>
                            <p>작성일: {post.CreatedAt}</p>
                            <button onClick={() => handleDeletePost(post.PostID)}>삭제</button>
                            <button onClick={() => handleEditPost(post)}>수정</button>
                        </li>
                    ))}
                </ul>
            </>
        );
    } else if (mode === 'CREATE') {
        content = <CreatePost setMode={setMode} />;
    } else if (mode === 'EDIT') {
        content = <EditPost post={selectedPost} setMode={setMode} />;
    }

    return (
        <div className="background">
            {content}
        </div>
    );
}

export default App;
