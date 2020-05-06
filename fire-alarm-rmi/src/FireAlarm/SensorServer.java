/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FireAlarm;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
//import java.net.http.HttpClient;
import java.net.http.HttpRequest;
//import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.MalformedURLException;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.registry.Registry;
import java.rmi.registry.LocateRegistry;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
/**
 *
 * @author Dasun
 */
public class SensorServer extends UnicastRemoteObject implements SensorService{

    
    public SensorServer() throws RemoteException{
        super();
    }
    
    //Admin login
    @Override
    public boolean login(String name, String password) throws RemoteException {
        try{
            URL url = new URL ("http://localhost:9000/api/admin/login");
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);
            String jsonInputString = "{\n" +
                    "	\"email\":\""+name+"\",\n" +
                    "	\"password\":\""+password+"\"\n" +
                    "}";
            
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            } catch (IOException ex) {
                Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                if(con.getResponseCode() == 200){
                    try(BufferedReader br = new BufferedReader(
                            new InputStreamReader(con.getInputStream(), "utf-8"))) {
                        StringBuilder response = new StringBuilder();
                        String responseLine = null;
                        while ((responseLine = br.readLine()) != null) {
                            response.append(responseLine.trim());
                        }
                        System.out.println(con.getResponseCode());
                    } catch (IOException ex) {
                        Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                    return true;
                    //returning true if admin credentials valid
                }else{
                    System.out.println("Error can't log in");
                    return false;
                }
            } catch (IOException ex) {
                Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        } catch (MalformedURLException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ProtocolException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }

    @Override
    public String getSensors() throws RemoteException {
        String res = null;
        try {
            ArrayList<Sensor> sensors = new ArrayList<Sensor>();
            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpGet request = new HttpGet("http://localhost:9000/api/sensors");
            CloseableHttpResponse response = httpClient.execute(request);
            HttpEntity entity = response.getEntity();
            res = EntityUtils.toString(entity);
            //System.out.println(res);
            return res;
        } catch (IOException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return res;
    }
    
    
    //Updating sensor details
    @Override
    public boolean updateSensor(String id, int room, int floor) throws RemoteException {
        try {
            //Creating JSON Body
            String data = "{\n" +
                "	\"floorNo\": "+floor+",\n" +
                "	\"roomNo\" :"+room+"\n" +
                "}";
            
            HttpClient httpClient = new DefaultHttpClient();
            // Prepare a request object
            HttpUriRequest req = new HttpPatch("http://localhost:9000/api/sensors/"+id);
            req.setHeader("Content-type", "application/json");
            //Setting headers and content types
            final StringEntity stringData = new StringEntity(data.toString());
            ((HttpPatch)req).setEntity(stringData);
            HttpResponse execute = httpClient.execute(req);
            //executing
            if(execute.getStatusLine().getStatusCode() == 200){
                return true;
                //return true if status code is 200(200 is the code of success)
            }
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false; //if code is not 200 or any other error happens, return false
    }

    //adding new sensor
    @Override
    public boolean addSensor(int room, int floor) throws RemoteException {
        try{
            //creating the api url
            URL url = new URL ("http://localhost:9000/api/sensors");
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            //setting methods and other details
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);
            //creating json body
            String jsonInputString = "{\n" +
                "	\"status\":true,\n" +
                "	\"floorNo\":" +floor+",\n" +
                "	\"roomNo\" :" +room+",\n" +
                "	\"co2\":1,\n" +
                "	\"smoke\":1\n" +
                "}";
            
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            } catch (IOException ex) {
                Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                if(con.getResponseCode() == 201){
                    try(BufferedReader br = new BufferedReader(
                            new InputStreamReader(con.getInputStream(), "utf-8"))) {
                        StringBuilder response = new StringBuilder();
                        String responseLine = null;
                        while ((responseLine = br.readLine()) != null) {
                            response.append(responseLine.trim());
                        }
                        System.out.println(con.getResponseCode());
                    } catch (IOException ex) {
                        Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                    return true;
                }else{
                    System.out.println("Error can't add new sensor");
                    return false;
                }
            } catch (IOException ex) {
                Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        } catch (MalformedURLException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ProtocolException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SensorServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }
    
    public static void main(String[] args){
        System.setProperty("java.security.policy", "file:allowal.policy");
        
        try{
            SensorServer svr = new SensorServer();
            Registry registry = LocateRegistry.createRegistry(Registry.REGISTRY_PORT);
            registry.rebind("SensorService",svr);
            System.out.println ("Service started...."+ registry);
            
        } catch (RemoteException ex) {
            System.err.println("ERROR1 "+ex.getMessage());
        }
    }

    @Override
    public boolean sendEmail(String msg) throws RemoteException {
        String user = "user@gmail.com"; // user email
        String password = "******"; // password for user
        
        // Recipient's email ID needs to be mentioned.
        String to = "recipients email";

        // Sender's email ID needs to be mentioned
        String from = user;

        // Assuming you are sending email from through gmails smtp
        String host = "smtp.gmail.com";

        // Get system properties
        Properties properties = System.getProperties();

        // Setup mail server
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.auth", "true");

        //authonticate mail and password
         Session session = Session.getDefaultInstance(properties,  
          new javax.mail.Authenticator() {  
            protected PasswordAuthentication getPasswordAuthentication() {  
                return new PasswordAuthentication(user,password);  
            }  
          });  

         //Compose the message  
          try {  
           MimeMessage message = new MimeMessage(session);  
           message.setFrom(new InternetAddress(user));  
           message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));  
           message.setSubject("Fire Alarm Monitor");
           
           message.setText("Hello \n These Sensors indicates high amount of Gas or CO2 levels \n" + msg);  

          //send the message  
           Transport.send(message);  

           System.out.println("message sent successfully...");  

           } catch (MessagingException e) {e.printStackTrace();}
              return false;
    }   
}
