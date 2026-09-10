package com.lagcrusher.android

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat

class CrusherService : Service() {

    companion object {
        const val CHANNEL_ID = "crusher_channel"
        const val NOTIFICATION_ID = 1337
        const val ACTION_START = "com.lagcrusher.START"
        const val ACTION_STOP = "com.lagcrusher.STOP"
        const val ACTION_UPDATE = "com.lagcrusher.UPDATE"
        const val EXTRA_LATENCY = "latency"
        const val EXTRA_PING_COUNT = "ping_count"

        private var isRunning = false
        private var wakeLock: PowerManager.WakeLock? = null

        fun isServiceRunning(): Boolean = isRunning

        fun updateNotification(context: Context, latency: String, pingCount: String) {
            if (!isRunning) return
            val notification = buildNotification(context, latency, pingCount)
            val manager = context.getSystemService(NotificationManager::class.java)
            manager.notify(NOTIFICATION_ID, notification)
        }

        private fun buildNotification(context: Context, latency: String, pingCount: String): Notification {
            createNotificationChannel(context)

            // Stop action
            val stopIntent = Intent(context, CrusherService::class.java).apply {
                action = ACTION_STOP
            }
            val stopPendingIntent = PendingIntent.getService(
                context, 2, stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            return NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle("Lag Crusher Active")
                .setContentText("Latency: ${latency}ms · Pings: $pingCount")
                .setSmallIcon(android.R.drawable.ic_menu_send)
                .setOngoing(true)
                .setSilent(true)
                .addAction(android.R.drawable.ic_media_pause, "Stop", stopPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .build()
        }

        private fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    "Lag Crusher",
                    NotificationManager.IMPORTANCE_LOW
                ).apply {
                    description = "Shows Lag Crusher is running"
                    setShowBadge(false)
                }
                val manager = context.getSystemService(NotificationManager::class.java)
                manager.createNotificationChannel(channel)
            }
        }

        private fun acquireWakeLock(context: Context) {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "LagCrusher::PingWakeLock"
            ).apply {
                acquire(60 * 60 * 1000L) // 1 hour max
            }
        }

        private fun releaseWakeLock() {
            wakeLock?.let {
                if (it.isHeld) it.release()
            }
            wakeLock = null
        }
    }

    override fun onBind(intent: Intent): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                isRunning = false
                releaseWakeLock()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return START_NOT_STICKY
            }
            ACTION_UPDATE -> {
                val latency = intent.getStringExtra(EXTRA_LATENCY) ?: "..."
                val pingCount = intent.getStringExtra(EXTRA_PING_COUNT) ?: "0"
                updateNotification(this, latency, pingCount)
                return START_STICKY
            }
            else -> {
                // START
                isRunning = true
                acquireWakeLock(this)
                val notification = buildNotification(this, "...", "0")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
                } else {
                    startForeground(NOTIFICATION_ID, notification)
                }
                return START_STICKY
            }
        }
    }

    override fun onDestroy() {
        isRunning = false
        releaseWakeLock()
        super.onDestroy()
    }
}
