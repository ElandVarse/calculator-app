import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Button from './src/components/Button'
import Display from './src/components/Display'

//Configuração inicial
const initialState = {
	displayValue: '0',
	clearDisplay: false,
	operation: null,
	values: [0, 0],
	//Current é a posição do array
	current: 0,
}

export default class App extends Component {
	state = { ...initialState }
	//Lógica adicionar digitos
	addDigit = n => {
		//Limpa o display caso só tenha 0 ou quando o clearDisplay é true
		const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

		//Se o user digitou '.', não vai limpar o display ou já tem um ponto digitado, não retorna outro ponto 
		if(n==='.' && !clearDisplay && this.state.displayValue.includes('.')){
			return
		}

		//Valor corrente é o que tá no display
		const currentValue = clearDisplay ? '' : this.state.displayValue
		//Concatena o valor current com o novo digitado n
		const displayValue = currentValue + n
		//Atualiza o displayValue pra ser o valor concatenado acima
		this.setState({displayValue, clearDisplay:false})

		//Caso seja digitado um valor válido após o ponto
		if(n !== '.'){
			//newValue guarda o novo valor como um float
			const newValue = parseFloat(displayValue) 
			const values = [...this.state.values]
			values[this.state.current] = newValue
			this.setState({ values })
		}
	}
	//Resetar os dados
	clearMemory = () => {
		this.setState({...initialState})
	}
	//Lógica escolher a função
	setOperation = operation => {
		if(this.state.current===0){
			//Quando a operação for escolhida, o display será zerado pra inserir novos valores
			this.setState({operation, current: 1, clearDisplay: true})
		} else {
			const equals = operation === '='
			const values = [...this.state.values]
			try{
				//Eval pega os valores e a operação e retorna o resultado
				values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)
			}
			catch(e){
				values[0] = this.state.values[0]
			}

			values[1] = 0
			this.setState({
				displayValue: `${values[0]}`,
				operation: equals ? null : operation,
				current: equals ? 0 : 1,
				clearDisplay: true,
				values,
			})

		}
	}

	render(){
		return (
			<View style={styles.container}>
				<Display value={this.state.displayValue} />

				<View style={styles.buttons}>
					<Button label='AC' triple onClick={this.clearMemory}/>
					<Button label='/' 	operation onClick={this.setOperation}/>
					<Button label='7' onClick={this.addDigit}/>
					<Button label='8' onClick={this.addDigit }/>
					<Button label='9' onClick={this.addDigit}/>
					<Button label='*' 	operation onClick={this.setOperation} />
					<Button label='4' onClick={this.addDigit}/>
					<Button label='5' onClick={this.addDigit}/>
					<Button label='6' onClick={this.addDigit}/>
					<Button label='-' 	operation onClick={this.setOperation}/>
					<Button label='1' onClick={this.addDigit}/>
					<Button label='2' onClick={this.addDigit}/>
					<Button label='3' onClick={this.addDigit}/>
					<Button label='+' 	operation onClick={this.setOperation}/>
					<Button label='0' double onClick={this.addDigit}/>
					<Button label='.' onClick={this.addDigit}/>
					<Button label='=' 	operation onClick={this.setOperation}/>
				</View>
				<StatusBar style="light" />
			</View>
		);
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	buttons:{
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	
});
