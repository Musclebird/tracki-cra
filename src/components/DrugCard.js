import {
	Body,
	Button,
	Card,
	CardItem,
	Container,
	Content,
	Form,
	Header,
	Icon,
	Item,
	Left,
	Right,
	Text
} from 'native-base';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import React, { Component } from 'react';
import TimeSince from 'TimeSince';
import FlipCard from 'react-native-flip-card';
import PropTypes from 'prop-types';

export default class DrugCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flip: false
		};
	}
	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress}>
				<View>
					<FlipCard
						flipHorizontal={true}
						flipVertical={false}
						style={{ flex: 1, borderWidth: 0 }}
						clickable={false}
						flip={this.state.flip}
						friction={15}
					>
						<Card>
							<CardItem>
								<Body>
									<Text>
										{this.props.name} ({this.props.measurement})
									</Text>
									<Text note>
										{this.props.timestamp
											? <TimeSince timestamp={this.props.timestamp} />
											: 'Never taken!'}
									</Text>
								</Body>
								<Right>
									{this.props.statistics
										? <Button primary transparent onPress={() => this.setState({ flip: true })}>
												<Icon name="ios-information-circle-outline" />
											</Button>
										: null}
								</Right>
							</CardItem>
							{this.props.photoUri
								? <CardItem cardBody>
										<Image
											source={{
												uri: this.props.photoUri
											}}
											style={{ height: 200, width: null, flex: 1 }}
										/>
									</CardItem>
								: null}

							{this.props.onPressDelete || this.props.onPressEdit
								? <CardItem style={{ flex: 1, height: 45 }}>
										<Left>
											<Button transparent onPress={this.props.onPressEdit}>
												<Icon name="ios-create-outline" />
											</Button>
										</Left>
										<Body />
										<Right>
											{this.props.onPressDelete
												? <Button transparent danger onPress={this.props.onPressDelete}>
														<Icon name="md-trash" />
													</Button>
												: null}
										</Right>
									</CardItem>
								: null}
						</Card>
						{/* Back */}
						<Card>
							<CardItem>
								<Left>
									<Button primary transparent onPress={() => this.setState({ flip: false })}>
										<Icon name="ios-arrow-back" />
									</Button>
								</Left>
								<Right>
									<Text header>{this.props.name} statistics</Text>
								</Right>
							</CardItem>
							<CardItem cardBody>
								{this.props.statistics ? <this.props.statistics /> : null}
								<Body>
									<Image
										source={{
											uri: this.photoUri
										}}
										style={{ height: 200, width: null, flex: 1 }}
									/>
								</Body>
							</CardItem>
							<CardItem />
						</Card>
					</FlipCard>
				</View>
			</TouchableHighlight>
		);
	}
}

DrugCard.propTypes = {
	name: PropTypes.string.isRequired,
	measurement: PropTypes.string.isRequired,
	photoUri: PropTypes.string,
	statistics: PropTypes.element,
	onPressEdit: PropTypes.func,
	onPressDelete: PropTypes.func,
	onPress: PropTypes.func,
	lastEntryTimestamp: PropTypes.number
};
