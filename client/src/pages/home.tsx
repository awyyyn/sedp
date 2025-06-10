import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { Helmet } from "react-helmet";

import heroImg from "@/assets/hero-img.png";
import UserLayout from "@/layouts/user-layout";

const sedp = [
	{
		title: "Empowering",
		description:
			"Thousand of members all over the Bicol Region and Some Parts of Northern Samar",
	},
	{
		title: "Empowering",
		description:
			"Needy families, providing financial and non-financial services",
	},
	{
		title: "development",
		description:
			"Their socio-economic condition to become strong and self-sustaining centers in their communities.",
	},
	{
		title: "people",
		description:
			"SEDP - Simbag sa Pag - Asenso - serving, empowering and developing people in a sustainable way",
	},
];

export default function Home() {
	const matches = useMediaQuery("(min-width: 800px)");

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Home | SEDP</title>
				<meta
					name="description"
					content="SEDP - Simbag sa Pag-Asenso, Inc. is a microfinance NGO that empowers communities through financial and non-financial services."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="relative min-h-screen flex items-center  min-w-full overflow-hidden">
				<UserLayout />
				<div className="h-full px-5 md:px-5 z-40    space-y-5 container mx-auto flex flex-col justify-center py-10">
					<h1 className="text-[#1B3899] text-5xl md:text-7xl font-extrabold">
						SEDP - SIMBAG SA
						<br />
						PAG-ASENSO, INC.
					</h1>
					<p className="max-w-screen-sm">
						The SEDP Scholarship Program, which began in 2004, provides
						educational assistance to underprivileged students, helping them
						achieve their academic goals. Through this scholarship, SEDP
						continues to empower the youth and invest in the future of
						communities.
					</p>
					<p className="max-w-screen-sm">
						You can access more updates and announcements by visiting our
						official Facebook page: <br />
						SEDP - Simbag sa Pag - Asenso, Inc.
					</p>
					<Button
						as={Link}
						to="https://www.facebook.com/sedp.ph"
						target="_blank"
						className="max-w-fit px-4 bg-[#1B3899] text-white"
						radius="none">
						Official FB Page
					</Button>
				</div>
				<img
					src={heroImg}
					alt="Sedp Background"
					className="lg:w-[45vw] absolute sm:w-[70vw] -z-50 md:h-[115dvh] transform rotate-[16deg] bottom-0 opacity-10 md:opacity-35 -right-[50px] md:rotate-[11deg] md:-right-[4dvw] md:top-[-10dvh]"
				/>
			</div>
		</>
	);

	return (
		<div className="">
			<div className="flex p-3 md:p-5 text-sm z-50 sticky top-0 bg-primary text-white w-full justify-between items-center flex-wrap gap-3">
				<div className="flex items-center gap-1 flex-wrap">
					<Icon icon="mage:email" fontSize={24} />
					<p>mfi@sedp.ph | simbag_sedp@yahoo.com</p>
				</div>
				<div className="flex items-center gap-1 flex-wrap">
					<Icon icon="akar-icons:schedule" fontSize={24} />
					<p>Mon. - Sat. (8:00 AM - 5:00 PM)</p>
				</div>
				<div className="flex items-center gap-1">
					<Icon icon="mingcute:location-line" fontSize={24} />
					<a
						href="https://www.google.com/maps/place/SEDP+-+SIMBAG+SA+PAG-ASENSO,+INC.+(A+MICROFINANCE+NGO)/@13.137921,123.733566,15z/data=!4m5!3m4!1s0x0:0xc91546dc7370ea2d!8m2!3d13.137921!4d123.733566?shorturl=1"
						target="_blank"
						rel="noreferrer">
						The Chancery, Cathedral Compound Albay, Legazpi City 4500
					</a>
				</div>
			</div>
			<section className="">
				<CarouselProvider
					naturalSlideWidth={100}
					naturalSlideHeight={matches ? 40 : 70}
					totalSlides={4}
					isPlaying
					infinite
					touchEnabled
					interval={8000}>
					<Slider>
						{sedp.map((sdp, inx) => (
							<Slide index={inx} key={inx}>
								<div className="h-full flex flex-col justify-center items-center relative">
									{/* Overlay Div 1 - Animate from right to left when in view */}
									<motion.div
										initial={{ x: "100%" }}
										whileInView={{
											x: 0,
										}}
										viewport={{ once: false }}
										transition={{
											duration: 0.5,
										}}
										className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-5 z-10"
									/>

									{/* Overlay Div 2 - Animate from right to left with delay when in view */}
									<motion.div
										initial={{ x: "100%" }}
										whileInView={{
											x: 0,
										}}
										viewport={{ once: false }}
										transition={{
											duration: 0.6,
											delay: 0.1,
										}}
										className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-5 z-10"
									/>

									{/* Title Animation */}
									<motion.div
										initial="hidden"
										whileInView="visible"
										viewport={{ once: false }}
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: {
												opacity: 1,
												y: 0,
												transition: {
													staggerChildren: 0.2,
													damping: 0,
													delay: 1,
												},
											},
										}}
										className="text-3xl md:text-5xl font-extrabold tracking-wider uppercase z-20">
										{sdp.title.split("").map((word, index) => (
											<motion.span
												key={index}
												variants={{
													hidden: { opacity: 0, y: 20 },
													visible: {
														opacity: 1,
														y: 0,
														transition: { duration: 3 },
													},
												}}
												className={
													index === 0
														? "text-primary text-5xl md:text-7xl leading-none"
														: ""
												}>
												{word}
											</motion.span>
										))}
									</motion.div>

									{/* Description Animation with delay */}
									<motion.p
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: false }}
										transition={{
											delay: 2, // Delay after the overlays for description animation
											duration: 1.5,
										}}
										className="text-center max-w-[80%] md:max-w-[30%] z-20">
										{sdp.description}
									</motion.p>
								</div>
							</Slide>
						))}
					</Slider>
				</CarouselProvider>
			</section>

			<Link to="/account" className="fixed bottom-5 right-5 z-50">
				Account
			</Link>
		</div>
	);
}
