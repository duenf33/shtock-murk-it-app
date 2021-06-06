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
} from "@material-ui/core";
import { ShowChart } from "@material-ui/icons";

import useStyles from "./styles";

import useSearchHooks from "../src/components/hooks/useSearchHooks";
import axios from "axios";

dotenv.config();

// const cards = [1, 2, 3, 4, 5, 6, 7];
const cards = [1];

const App = () => {
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
					setData(searchData.data[searchArrayTrim].meta);
				}
			} else {
				return setData(searchData.data);
			}
			setData(searchData.data.meta);
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
	return (
		<>
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar>
					<ShowChart className={classes.icon} />
					<Typography variant="h6">Shtock-murk-it App</Typography>
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
				<Container className={classes.cardGrid} maxWidth="md">
					<Grid container spacing={4}>
						{cards.map((card, index) => (
							<Grid item key={index} xs={12} sm={6} md={4}>
								<Card className={classes.card}>
									<CardMedia
										className={classes.cardMedia}
										image="https://source.unsplash.com/random"
										title="Image title"
									/>
									<CardContent className={classes.cardContent}>
										<Typography gutterBottom variant="h5">
											{card}
										</Typography>
										<Typography>This is: {card}</Typography>
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
						)
						)}
					</Grid>
				</Container>
			</main>
			<footer className={classes.footer}>
				<Typography variant="h6" align="center" gutterBottom>
					Footer
				</Typography>
				<Typography variant="subtitle1" align="center" color="textSecondary">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit.
				</Typography>
			</footer>
		</>
	);
};

export default App;
