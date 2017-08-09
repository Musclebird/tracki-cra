import { Icon, View } from 'native-base';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

import PropType from 'prop-types';

const styles = StyleSheet.create({
    center: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
PhotoButton = (props) => {
    return (
        <TouchableOpacity
            style={{
                height: props.height,
                width: props.width,
                flex: 1,
                borderRadius: props.circle ? props.height / 2 : 0,
                padding: props.padding
            }}
            onPress={props.onPress}
        >
            <View
                style={{
                    borderWidth: props.circle ? (props.photo ? 0 : props.borderWidth) : props.borderWidth,
                    height: props.height,
                    width: props.width,
                    backgroundColor: props.photo ? null : props.background,
                    borderRadius: props.circle ? props.height / 2 : 0
                }}
            >
                <View style={styles.center}>
                    {props.photo ? (
                        <Image
                            source={{ uri: props.photo }}
                            style={{
                                height: props.height,
                                width: props.width,
                                position: 'absolute',
                                borderWidth: props.circle ? (props.photo ? 0 : props.borderWidth) : props.borderWidth,
                                borderRadius: props.circle ? props.height / 2 : 0
                            }}
                        />
                    ) : null}
                </View>
                <View style={styles.center}>
                    <Icon name="ios-camera" style={{ opacity: props.photo ? 0.5 : 0.75 }} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

PhotoButton.propTypes = {
    height: PropType.number,
    width: PropType.number,
    borderWidth: PropType.number,
    padding: PropType.number,
    photo: PropType.string,
    iconOverlay: PropType.bool,
    circle: PropType.bool,
    background: PropType.string,
    onPress: PropType.func,
    borderColor: PropType.string
};

PhotoButton.defaultProps = {
    height: 50,
    width: 50,
    borderWidth: 1,
    padding: 0,
    iconOverlay: true
};

export default PhotoButton;
