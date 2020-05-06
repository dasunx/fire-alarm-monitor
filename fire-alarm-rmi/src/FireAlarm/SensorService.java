/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FireAlarm;
import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 *
 * @author Dasun
 */
public interface SensorService extends Remote{
    public boolean login(String name,String password) throws RemoteException;
    public String getSensors() throws RemoteException;
    public boolean updateSensor(String id,int room, int floor) throws RemoteException;
    public boolean addSensor(int room, int floor) throws RemoteException;
    public boolean sendEmail(String msg) throws RemoteException;
}
