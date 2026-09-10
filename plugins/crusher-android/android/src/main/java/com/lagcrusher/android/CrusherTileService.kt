package com.lagcrusher.android

import android.content.Intent
import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

class CrusherTileService : TileService() {

    override fun onStartListening() {
        super.onStartListening()
        updateTile()
    }

    override fun onClick() {
        super.onClick()
        if (CrusherService.isServiceRunning()) {
            // Stop the service
            val intent = Intent(this, CrusherService::class.java).apply {
                action = CrusherService.ACTION_STOP
            }
            startForegroundService(intent)
        } else {
            // Start the service
            val intent = Intent(this, CrusherService::class.java).apply {
                action = CrusherService.ACTION_START
            }
            startForegroundService(intent)
        }
        updateTile()
    }

    private fun updateTile() {
        val tile = qsTile ?: return
        if (CrusherService.isServiceRunning()) {
            tile.state = Tile.STATE_ACTIVE
            tile.label = "Crusher On"
            tile.contentDescription = "Lag Crusher is running"
        } else {
            tile.state = Tile.STATE_INACTIVE
            tile.label = "Crusher Off"
            tile.contentDescription = "Lag Crusher is stopped"
        }
        tile.updateTile()
    }

    override fun onStopListening() {
        super.onStopListening()
        updateTile()
    }
}
