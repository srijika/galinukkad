import React, {useState, useEffect} from 'react';
import RecommendProducts from './RecommendProducts';
import axios from 'axios';
import { useRouter } from 'next/router'
import Parser from 'html-react-parser';
import { baseUrl } from '../../../repositories/Repository';
import {   FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    WhatsappShareButton,
    EmailShareButton } from "react-share";
import { FacebookIcon, TwitterIcon  , LinkedinIcon,
    PinterestIcon, WhatsappIcon} from "react-share";


const PostDetailBackground = (props) => {

    const router = useRouter()
    let id= router.query.pid;

    const [post, setPost] = useState({});
    const [modal, setModal] = useState(false);
    const [img, setImg] = useState('');
    let title;
   let url;
if (typeof window !== "undefined") {
     
      title = window.document.title 
      url = window.location.href
//  console.log(title)
}



    useEffect(() => {
        getPostDetail();
    }, [])

    const getPostDetail = async () => {

        // console.log('post detail a[o');
        let res = await axios.post(`get/blog/detail`, { id: id });
    
        if(res.data.blog === null){
            let res1 = await axios.post(`/get/news/detail`, { id: id });
             setPost(res1.data.blog)
             setModal(true)
             setImg(`${baseUrl}/thumbnail/${res1.data.blog.images[0].file}`)
        }else{
setPost(res.data.blog)
setModal(false)
    console.log(res.data.blog === null)
    console.log(res.data.blog)


setImg(`${baseUrl}/blogs/${res.data.blog.image}`)
        }
       
     
       


    }



    return (
    <div className="ps-post--detail ps-post--parallax img-fluid">
        <div
            className="ps-post__header bg--parallax mobile_back_img"
                       style={{ backgroundImage: `url(${img})`,     backgroundSize : "100% !important" }}

            >
            <div className="container">
                <h3 className="text-warning text-capitalize ">
                {post.category_id && post.category_id.category_name}
                </h3>
                <h1>
                    {/* Harman Kadon Onyx Studio Mini, <br /> Reviews & Experiences */}
                    {post.title}
                </h1>
                {/* <p>December 17/ 2017 </p> */}
                {/* <p> {moment(post.created_at)} </p> */}
    

            </div>
        </div>
        <div className="container">
            <div className="ps-post__content">
            {modal ? <div className="content">{post.description}</div>
            :
              <div className="content" dangerouslySetInnerHTML={{ __html: post.html? Parser(post.html) : '<p>No description found.</p>' }}  ></div>
            }
                
              

                {/* 
                <h4>
                    On the off chance that you have an escalated stop, mull over
                    a short taking a gander at outing. This especially is shrewd
                    in urban areas with brilliant open transportation decisions.
                </h4>
                <p>
                    Today most people get on average 4 to 6 hours of exercise
                    every day, and make sure that everything they put in their
                    mouths is not filled with sugars or preservatives, but they
                    pay no attention to their mental health, no vacations, not
                    even the occasional long weekend. All of this for hopes of
                    one day getting that big promotion.This response is
                    important for our ability to learn from mistakes, but it
                    also gives rise to self-criticism, because it is part of the
                    threat-protection system. In other words, what keeps us safe
                    can go too far, and keep us too safe. In fact, it can
                    trigger self-censoring. Coven try is a city with a thousand
                    years of history that has plenty to offer the visiting
                    tourist. Located in the heart of Warwickshire. One morning,
                    when Gregor Samsa woke from troubled dreams, he found
                    himself transformed in his bed into a horrible vermin. He
                    lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections.
                </p>
                <blockquote className="ps-blockquote">
                    <p>
                        “When you think ‘I know’ and ‘it is,’ you have the
                        illusion of knowing, the illusion of certainty, and then
                        you’re mindless”
                    </p>
                    <span className="ps-blockquote__author">
                        JELLY CRISTIANA
                    </span>
                </blockquote>
                <p>
                    That immediately brought to mind one of my fondest memories,
                    involving my daughter when she was just a toddler of one:
                    taking her with me on the short walk to check the mail. I
                    live in a small enclave of homes in which all the mailboxes
                    are together in a central location, less than a minute’s
                    walk from my front door
                </p>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
                        <img
                            className="mb-30"
                            src="/static/img/blog/detail/2.jpg"
                            alt="Galinukkad"
                        />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 ">
                        <img
                            className="mb-30"
                            src="/static/img/blog/detail/3.jpg"
                            alt="Galinukkad"
                        />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 ">
                        <img
                            className="mb-30"
                            src="/static/img/blog/detail/4.jpg"
                            alt="Galinukkad"
                        />
                    </div>
                </div>
                <h4>Defaulting to Mindfulness: The Third Person Effect</h4>
                <p>
                    Cray post-ironic plaid, Helvetica keffiyeh tousled Carles
                    banjo before they sold out blog photo booth Marfa semiotics
                    Truffaut. Mustache Schlitz next level blog Williamsburg,
                    deep v typewriter tote bag Banksy +1 literally.
                </p>
                <ul>
                    <li>Welsh novelist Sarah Waters sums it up eloquently</li>
                    <li>
                        In their classic book, Creativity in Business, based on
                        a popular course they co-taught
                    </li>
                    <li>Novelist and screenwriter Steven Pressfield</li>
                    <li>
                        A possible off-the-wall idea or solution appears like a
                        blip and disappears without us even realizing
                    </li>
                </ul>
                <p>
                    The short answer is yes. <strong>According to Kross</strong>
                    , when you think of yourself as another person, it allows
                    you give yourself more objective, helpful feedback.
                </p>
                <h4>Recommended Items</h4>
                <p>
                    Both of these assumptions, of course, could be entirely
                    false. Self-censoring is firmly rooted in our experiences
                    with mistakes in the past and not the present
                </p> */}
                {/* <RecommendProducts /> */}
            </div>
            <div className="ps-post__footer">
                {/* <p className="ps-post__tags">
                    Tags:<a href="#">business</a>
                    <a href="#">technology</a>
                </p> */}
                <div className="ps-post__social">
                    {/* <a className="facebook" href="https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fu%3Dhttp%273A%272F%272Fgithub.com%26quote%3DGitHub&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=hi_IN">
                        <i className="fa fa-facebook"></i>
                    </a>
                    <a className="twitter" href="#">
                        <i className="fa fa-twitter"></i>
                    </a>
                    <a className="google" href="#">
                        <i className="fa fa-google-plus"></i>
                    </a>
                    <a className="linkedin" href="#">
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <a className="pinterest" href="#">
                        <i className="fa fa-pinterest"></i>
                    </a> */}
    
       <FacebookShareButton quote={title} url={url} title={title} className="ml-2">
            <FacebookIcon
              size={"7rem"} // You can use rem value instead of numbers
              round
            />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title} className="ml-2">
            <TwitterIcon size={"7rem"} round />
          </TwitterShareButton>

          <WhatsappShareButton title={title} url={url} separator=":: " className="ml-2">
            <WhatsappIcon size={"7rem"} round />
          </WhatsappShareButton>

          <LinkedinShareButton
          className="ml-2"
            title={title}
            url={url}
            windowWidth={770}
            windowHeight={600}
          >
            <LinkedinIcon size={"7rem"} round />
          </LinkedinShareButton>

          <PinterestShareButton
          className="ml-2"
            url={url}
            media={`${url}`}
            windowWidth={1000}
            windowHeight={730}
          >
            <PinterestIcon size={"7rem"} round />
          </PinterestShareButton>

                </div>
            </div>
        </div>
    <hr />

    </div>
    )
};

export default PostDetailBackground;
