/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FireAlarm;

/**
 *
 * @author Dasun
 */
public class Sensor {
    public String id;
    public boolean status;
    public int roomNo;
    public int floorNO;
    public int co2;
    public int gas;
    
    public Sensor (String id,boolean status,int r, int s, int d, int g){
        this.id = id;
        this.status = status;
        this.roomNo = r;
        this.floorNO = s;
        this.co2 = d;
        this.gas = g;
    }
    
    
            
}
