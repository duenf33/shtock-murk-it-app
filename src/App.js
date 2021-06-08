import React, { useState, useEffect, useContext } from "react";
import dotenv from "dotenv";
import {
	Typography,
	AppBar,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CssBaseline,
	Grid,
	Toolbar,
	Container,
	ThemeProvider,
	createMuiTheme,
	Switch,
} from "@material-ui/core";
import {
	ResponsiveContainer,
	AreaChart,
	XAxis,
	YAxis,
	Area,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { CodeSharp, ShowChart } from "@material-ui/icons";

import useStyles from "./styles";
import "./styles.css";

import useSearchHooks from "../src/components/hooks/useSearchHooks";
import axios from "axios";

// const data = [];
// for (let num = 30; num >= 0; num--) {
// data.push({
// 	date: subDays(new Date(), num).toISOString(),
// 	value: 1 + Math.random()
// })
// }

dotenv.config();

// const cards = [1, 2, 3, 4, 5, 6, 7];
const cards = [1];

const App = () => {
	const [darkMode, setDarkMode] = useState(false);

	const theme = createMuiTheme({
		palette: {
			type: darkMode ? "dark" : "light",
		},
	});

	const handleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const [isButtonDisabled, setIsButtonDisabled] = useState(true);

	const [
		search,
		setSearch,
		inputSearchError,
		errorSearchMessage,
		isSearchOnBlur,
		handleSearchOnBlur,
	] = useSearchHooks();

	const [data, setData] = useState([]);
	const classes = useStyles();

	const handleOnSubmit = async (e) => {
		e.preventDefault();
		try {
			const searchData = await axios.get(
				`${process.env.REACT_APP_API_URL}?symbol=${search}&interval=1min&apikey=${process.env.REACT_APP_API_KEY}`
			);
			let searchArray = search.split(",");
			if (searchArray.length > 1) {
				for (let i = 0; i < searchArray.length; i++) {
					let searchArrayTrim = searchArray[i].trim();
					setData(searchData.data[searchArrayTrim].values);
				}
			} else {
				return setData(searchData.data.values);
			}
			// setData(searchData.data);
		} catch {
			console.log(e);
		}
	};
	useEffect(() => {
		if (inputSearchError === false) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
			return;
		}

		if (search.length == 0) {
			setIsButtonDisabled(true);
		} else {
			setIsButtonDisabled(false);
		}
	}, [search]);

	console.log(data);
	const bodyFunc = () => {
		return (
			<div>
				<Container className={classes.cardGrid} maxWidth="md">
					<Grid container spacing={4}>
						{/* {cards.map((card, index) => ( */}
						<Grid
							item
							// key={index}
							xs={12}
							sm={6}
							md={4}>
							<Card className={classes.card}>
								<CardMedia
									className={classes.cardMedia}
									image="https://source.unsplash.com/random"
									title="Image title"
								/>
								<CardContent className={classes.cardContent}>
									<Typography gutterBottom variant="h5">
										{/* {data} */}
									</Typography>
									<Typography>
										This is: {search.toUpperCase()}
										{/* {data.meta} */}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small" color="primary">
										View
									</Button>
									<Button size="small" color="primary">
										Edit
									</Button>
								</CardActions>
							</Card>
						</Grid>
						{/* ))} */}
					</Grid>
				</Container>
			</div>
		);
	};

	const CustomTooltip = ({ active, payload, label }) => {
		console.log(payload);
		if (active) {
			return (
				<div className="tooltip">
					<h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
				</div>
			);
		}
		return null;
	};

	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<AppBar position="relative">
						<Toolbar>
							<ShowChart className={classes.icon} />
							<Typography variant="h6">Shtock-murk-it App</Typography>
							<Switch onChange={handleDarkMode} value={darkMode} />
						</Toolbar>
					</AppBar>
					<main>
						<div className={classes.container}>
							<Container align="center" maxWidth="sm">
								<Typography
									variant="h2"
									align="center"
									color="textPrimary"
									gutterBottom>
									Shtock luck up
								</Typography>
								<Typography
									variant="h5"
									align="center"
									color="textSecondary"
									paragraph>
									You may enter the Shtock ticker symbol down below .
								</Typography>
								<form autoComplete="on" onSubmit={handleOnSubmit}>
									<FormControl error={inputSearchError}>
										<InputLabel htmlFor="input">Input here</InputLabel>
										<Input
											id="input"
											name="address search"
											value={search}
											onChange={(e) => setSearch(e)}
											onBlur={() => handleSearchOnBlur()}
										/>
										<FormHelperText id="component-error-text">
											{inputSearchError && errorSearchMessage}
										</FormHelperText>
									</FormControl>
									<div className={classes.buttons}>
										<Grid container spacing={2} justify="center">
											<Grid item>
												<Button
													variant="contained"
													color="primary"
													type="submit"
													disabled={isButtonDisabled}>
													Luck up
												</Button>
											</Grid>
										</Grid>
									</div>
								</form>
								<div></div>
							</Container>
						</div>
					</main>
					<div>
						{/* <div>
					<ul>
						{data.map((d, i) => {
							return <li key={i}>{d.datetime}</li>;
						})}
					</ul>
				</div> */}
						{bodyFunc()}
						<ResponsiveContainer width="100%" height={400}>
							<AreaChart data={data}>
								<defs>
									<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#2451b7" stopOpacity={0.4} />
										<stop offset="75%" stopColor="#2451b7" stopOpacity={0.05} />
									</linearGradient>
								</defs>
								<Area dataKey="close" stroke="#2451b7" fill="url(#color)" />
								<XAxis dataKey="datetime" axisLine={false} tickLine={false} />
								<YAxis
									dataKey="close"
									axisLine={false}
									tickLine={false}
									tickCount={8}
									tickFormatter={(number) => `$${number}`}
								/>
								<Tooltip content={<CustomTooltip />} />
								<CartesianGrid opacity={0.1} vertical={false} />
							</AreaChart>
						</ResponsiveContainer>
					</div>
					<footer className={classes.footer}>
						<Typography variant="h6" align="center" gutterBottom>
							Footer
						</Typography>
						<Typography
							variant="subtitle1"
							align="center"
							color="textSecondary">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit.
						</Typography>
					</footer>
				</CssBaseline>
			</ThemeProvider>
		</>
	);
};

export default App;
