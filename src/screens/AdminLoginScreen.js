import { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function AdminLoginScreen({navigation}) {
 const [usuario,setUsuario]=useState(""); const [senha,setSenha]=useState("");
 function msg(t,m){Platform.OS==="web"?alert(`${t}\n${m}`):Alert.alert(t,m);}
 function entrar(){if(usuario==="admin"&&senha==="12345"){setUsuario("");setSenha("");navigation.navigate("BancoDados");}else msg("Acesso negado","Usuário ou senha inválidos.");}
 return <View style={s.c}><Text style={s.t}>Acesso Administrativo</Text><Text style={s.p}>Manutenção direta do banco restrita ao administrador.</Text>
 <TextInput style={s.i} placeholder="Usuário" value={usuario} onChangeText={setUsuario} autoCapitalize="none"/>
 <TextInput style={s.i} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry/>
 <TouchableOpacity style={s.b} onPress={entrar}><Text style={s.bt}>Acessar manutenção</Text></TouchableOpacity>
 <TouchableOpacity style={s.v} onPress={()=>navigation.goBack()}><Text style={s.vt}>← Voltar</Text></TouchableOpacity></View>;
}
const s=StyleSheet.create({c:{flex:1,padding:24,justifyContent:"center",backgroundColor:"#F4F6F8"},t:{fontSize:28,fontWeight:"bold",color:"#003B71",marginBottom:8},p:{color:"#5D6770",marginBottom:24},i:{backgroundColor:"#FFF",padding:14,borderRadius:10,marginBottom:12},b:{backgroundColor:"#003B71",padding:15,borderRadius:10},bt:{color:"#FFF",textAlign:"center",fontWeight:"bold"},v:{padding:14},vt:{textAlign:"center",color:"#003B71",fontWeight:"bold"}});
