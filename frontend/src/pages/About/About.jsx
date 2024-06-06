import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import "./About.scss";

// image imports
import tick from "../../assets/about/tick-circle.svg";
import bulb from "../../assets/about/bulb.svg";
import rocket from "../../assets/about/rocket.svg";

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from "@chakra-ui/react";

function About() {
    const faqData = [
        {
            heading: "What is Internflow, and how does it work?",
            body: "Internflow is an all-in-one online platform that provides youth with an efficient and convenient way to search for opportunities that fit and interest them. With our easy-to-use filter system, our search engine will provide you with a comprehensive list of opportunities tailored specifically for you, from exciting internship opportunities to competitive events to really hone your skills. Whether you’re a Model UN delegate or a math athlete, or even just a normal student with an interest in a certain field - we have something for you!",
        },
        {
            heading: "Is Internflow only for high school students?",
            body: "No! Internflow is tailored mainly for high school students, but has plenty of opportunities for college or university students as well. Just pay attention to the 'Prerequisite' tag if there is one!",
        },
        {
            heading: "What types of opportunities are available on Internflow?",
            body: "We offer a plethora of different opportunity types to fit all your needs - internships, fellowships, events, scholarships, competitions, volunteering positions, and more. A full comprehensive list can be found in our easy-to-use tags, which offer a seamless, convenient search experience.",
        },
        {
            heading:
                "Can employers post their own entries on Internflow? If so, how?",
            body: `Yes! Use the form  <span><a href="https://docs.google.com/forms/d/e/1FAIpQLSecP_1OXq34DmOq4jm0hxzWh-lXKSV0BiD1Zf7jdElD90c-EQ/viewform" target="blank" class="contact-link" >here</a></span> or email us at internflow.ai@gmail.com to submit your post while we work on creating an automated system. We apologize for any inconvenience this may cause!`,
        },
        {
            heading: "Are the opportunities on Internflow paid or unpaid?",
            body: "The answer is both! In fact, we even have filters that help you identify which opportunities offer pay and which don't, so you can find exactly what you are looking for. Just choose the tags as you like!",
        },
        {
            heading: "Is there a fee to use Internflow?",
            body: "No! Internflow is completely free to use and non-profit. All the financial needs of the platform come out of the team's own pockets, because we believe in creating a better community for everyone. Built by youth, for youth!",
        },
        {
            heading: "How can I increase my chances of securing an offer?",
            body: `While there is no set formula for guaranteeing admission for a position, there are a few great tested methods to improve your chances. Check out our Resource Hub <span><a href="/resources" class="contact-link" >here</a></span> for more info!`,
        },
        {
            heading: "What should I do if I encounter technical issues?",
            body: "If you encounter any technical issues while using this platform, please don't hesitate to contact our team using the details at the bottom of this page. We will attempt to troubleshoot it and give you a satisfactory response as soon as possible.",
        },
        {
            heading:
                "Are there any safety measures in place to filter out fraudulent opportunity offers?",
            body: "Of course! Here at Internflow, we believe in only what's best for our users. Every opportunity listed on our site has passed through multiple layers of screening and verification to ensure they are legitimate. However, as policies change all the time, Internflow unfortunately cannot fully guarantee nothing goes wrong. If an incident occurs, please report it to us using the details at the bottom of this page. Stay safe, all!",
        },
    ];

    const controls = useAnimation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 300 && !isVisible) {
                setIsVisible(true);
                controls.start({ y: 0, opacity: 1 });
            }
        };

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [controls, isVisible]);

    return (
        <div className="about padding">
            <div className="about__container boxed">
                <h4 className="heading-quaternary">ABOUT</h4>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="heading-primary"
                >
                    We are helping students realize their dreams.
                </motion.h1>
                <motion.h5
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="heading-quinary"
                >
                    Here at Internflow, we believe in the potential of every
                    individual. Our goal is to connect need with need and
                    prepare youth for the future, connecting aspiring learners
                    searching for opportunities with placements looking for
                    them.
                </motion.h5>
                <div className="about__cards">
                    {/* Card One */}
                    <div className="about__cards__card color-pink">
                        <div className="card-top">
                            <img src={tick} alt="" className="card-icon" />
                            <h2 className="heading-secondary ">
                                ONE-STOP CONVENIENCE.
                            </h2>
                        </div>
                        <div className="card-body">
                            <h5 className="heading-quinary">
                                With the vast variety of resources spread out
                                across the Internet, Internflow serves as a
                                central hub for all-things opportunity, making
                                it the perfect companion for any student.
                            </h5>
                        </div>
                    </div>
                    {/* Card Two */}
                    <div className="about__cards__card color-blue">
                        <div className="card-top">
                            <img src={bulb} alt="" className="card-icon" />
                            <h2 className="heading-secondary ">
                                PERSONALIZED EXPERIENCE.
                            </h2>
                        </div>
                        <div className="card-body">
                            <h5 className="heading-quinary">
                                Our platform is specially designed to cater
                                towards each and every student’s individual
                                needs. With our simple tag-based filter system,
                                there’s something for everyone.
                            </h5>
                        </div>
                    </div>
                    {/* Card Three */}
                    <div className="about__cards__card color-purple">
                        <div className="card-top">
                            <img src={rocket} alt="" className="card-icon" />
                            <h2 className="heading-secondary ">
                                QUICk, DIRECT, EFFICIENT.
                            </h2>
                        </div>
                        <div className="card-body">
                            <h5 className="heading-quinary">
                                As students ourselves, we fully understand just
                                how busy youth are these days. That’s why we
                                created this site with efficiency in mind - one
                                quick search is all you need.
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="hr"></div>
            </div>

            {/* faq section */}
            <section className="about__faq">
                <h2 className="heading-primary">FAQs</h2>
                <Accordion allowToggle>
                    {faqData.map((faq, index) => {
                        return (
                            <AccordionItem
                                className="accordion-item"
                                key={index}
                            >
                                <AccordionButton className="accordion-btn">
                                    <Box as="span" flex="1" textAlign="left">
                                        <h2 className="accordion-heading">
                                            {faq.heading}
                                        </h2>
                                    </Box>
                                    <AccordionIcon className="accordion-icon" />
                                </AccordionButton>
                                <AccordionPanel
                                    pb={4}
                                    className="accordion-body"
                                >
                                    <p
                                        className="accordion-body-text"
                                        dangerouslySetInnerHTML={{
                                            __html: faq.body,
                                        }}
                                    ></p>
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </section>
            <div className="hr"></div>

            {/* contact us section */}
            <section className="about__contact">
                <h4 className="heading-quaternary heading-contact">
                    CONTACT US
                </h4>
                <h2 className="heading-primary">Still Stuck?</h2>
                <h5 className="heading-quinary">
                    Contact us{" "}
                    <span>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSecP_1OXq34DmOq4jm0hxzWh-lXKSV0BiD1Zf7jdElD90c-EQ/viewform"
                            target="blank"
                            className="contact-link"
                        >
                            here
                        </a>
                    </span>{" "}
                    or through our email, internflow.ai@gmail.com. We will try
                    to get back to you within 1-2 business days. Thank you!
                </h5>
            </section>
        </div>
    );
}

export default About;
